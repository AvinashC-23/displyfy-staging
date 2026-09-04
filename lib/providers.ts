import { Resend } from "resend";
import twilio from "twilio";

export type ProviderResult = {
  ok: boolean;
  simulated: boolean;
  providerReference?: string;
  failureCategory?: string;
};

export interface EmailProvider {
  sendTransactionalEmail(input: {
    to: string;
    subject: string;
    html: string;
    idempotencyKey: string;
  }): Promise<ProviderResult>;
}

export interface SmsProvider {
  sendSms(input: {
    to: string;
    body: string;
    idempotencyKey: string;
  }): Promise<ProviderResult>;
  startPhoneVerification(to: string): Promise<ProviderResult>;
}

export interface InstagramVerificationProvider {
  startOAuth(): Promise<ProviderResult>;
  getMetrics(reelUrl: string): Promise<ProviderResult & { views?: number }>;
}

export interface FileStorageProvider {
  createSignedUploadUrl(input: {
    ownerId: string;
    mimeType: string;
    byteSize: number;
  }): Promise<ProviderResult & { url?: string; path?: string }>;
}

export interface PaymentProvider {
  recordManualPayment(input: {
    payoutRecordId: string;
    amountMinor: number;
    currency: string;
    externalReference: string;
  }): Promise<ProviderResult>;
}

class SimulatedEmailProvider implements EmailProvider {
  async sendTransactionalEmail(): Promise<ProviderResult> {
    return { ok: true, simulated: true, providerReference: "simulated-email-queued" };
  }
}

class ResendEmailProvider implements EmailProvider {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendTransactionalEmail(input: {
    to: string;
    subject: string;
    html: string;
    idempotencyKey: string;
  }): Promise<ProviderResult> {
    const from = process.env.RESEND_FROM_EMAIL;
    if (!from || !process.env.RESEND_API_KEY) {
      return { ok: false, simulated: false, failureCategory: "provider_not_configured" };
    }

    const result = await this.resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      headers: {
        "Idempotency-Key": input.idempotencyKey
      }
    });

    if (result.error) {
      return { ok: false, simulated: false, failureCategory: result.error.name };
    }

    return { ok: true, simulated: false, providerReference: result.data?.id };
  }
}

class SimulatedSmsProvider implements SmsProvider {
  async sendSms(): Promise<ProviderResult> {
    return { ok: true, simulated: true, providerReference: "simulated-sms-queued" };
  }

  async startPhoneVerification(): Promise<ProviderResult> {
    return { ok: true, simulated: true, providerReference: "simulated-otp-created" };
  }
}

class TwilioSmsProvider implements SmsProvider {
  private client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  async sendSms(input: { to: string; body: string; idempotencyKey: string }): Promise<ProviderResult> {
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !messagingServiceSid) {
      return { ok: false, simulated: false, failureCategory: "provider_not_configured" };
    }

    const message = await this.client.messages.create({
      to: input.to,
      body: input.body,
      messagingServiceSid
    });

    return { ok: true, simulated: false, providerReference: message.sid };
  }

  async startPhoneVerification(to: string): Promise<ProviderResult> {
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !serviceSid) {
      return { ok: false, simulated: false, failureCategory: "provider_not_configured" };
    }

    const verification = await this.client.verify.v2.services(serviceSid).verifications.create({
      to,
      channel: "sms"
    });

    return { ok: true, simulated: false, providerReference: verification.sid };
  }
}

class ManualInstagramVerificationProvider implements InstagramVerificationProvider {
  async startOAuth(): Promise<ProviderResult> {
    return { ok: false, simulated: true, failureCategory: "manual_verification_only" };
  }

  async getMetrics(): Promise<ProviderResult & { views?: number }> {
    return { ok: false, simulated: true, failureCategory: "manual_metrics_required" };
  }
}

class SimulatedFileStorageProvider implements FileStorageProvider {
  async createSignedUploadUrl(input: {
    ownerId: string;
    mimeType: string;
    byteSize: number;
  }): Promise<ProviderResult & { url?: string; path?: string }> {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(input.mimeType) || input.byteSize > 5_000_000) {
      return { ok: false, simulated: true, failureCategory: "file_policy_rejected" };
    }

    return {
      ok: true,
      simulated: true,
      url: "/api/demo-upload-url",
      path: `demo/${input.ownerId}/${crypto.randomUUID()}`
    };
  }
}

class ManualPaymentProvider implements PaymentProvider {
  async recordManualPayment(): Promise<ProviderResult> {
    return { ok: true, simulated: true, providerReference: "manual-payment-recorded" };
  }
}

export function getProviders() {
  const useRealProviders = process.env.DISPLYFY_PROVIDER_MODE === "production";

  return {
    email: useRealProviders ? new ResendEmailProvider() : new SimulatedEmailProvider(),
    sms: useRealProviders ? new TwilioSmsProvider() : new SimulatedSmsProvider(),
    instagram: new ManualInstagramVerificationProvider(),
    storage: new SimulatedFileStorageProvider(),
    payments: new ManualPaymentProvider()
  };
}
