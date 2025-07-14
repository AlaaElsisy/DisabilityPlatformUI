
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  @ViewChild('questionInput') questionInput!: ElementRef<HTMLInputElement>;
  @ViewChild('loading') loadingRef!: ElementRef<HTMLElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLElement>;

  messages: Message[] = [
    {
      text: "Hello! I'm your Disability Support System assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ];
  userMessage = '';

  OPENAI_API_KEY: string = "";
  PROVIDER: string = "together";
  MODEL: string = "mistralai/Mixtral-8x7B-Instruct-v0.1";
  ENDPOINT: string = `https://router.huggingface.co/${this.PROVIDER}/v1/chat/completions`;

  chunks: string[] = [
    "Users can register as either a patient or a helper. After signing up, they log in and complete their profile, including basic information, skills (for helpers), and disability needs (for patients).",
    "Patients can create public service offers describing the help they need. These offers are visible to all helpers. They can also send direct requests to specific helpers for assistance.",
    "Patients can track the status of their service requests from their dashboard. Statuses include: Pending, Accepted, In Progress, Completed, and Cancelled.",
    "After a service is completed, patients can make secure payments through Stripe. The payment status is updated to Paid, and a receipt is available in their account.",
    "Helpers can post public service offers listing the type of help they provide, such as transportation, reading assistance, or daily tasks. Patients can view and apply to these offers.",
    "Helpers can view and respond to direct service requests sent by patients. They can choose to accept or reject the request based on their availability and preferences.",
    "After completing a service, helpers receive payment through Stripe. They can track the payment status, which may be Pending, Paid, or Failed, from their dashboard.",
    "The system uses SignalR to deliver real-time notifications. Patients and helpers receive instant alerts for new service offers, request status updates, and payment events.",
    "Helpers can manage their services by updating availability schedules, pricing, and service categories. Patients can view these details before submitting a request.",
    "The platform is being expanded to include features such as multi-language support, rating and review systems, appointment calendars, and administrative dashboards.",
    "Patients and helpers can register on the Disability Support System by filling out their personal information, including full name, email, password, phone number, address, region, date of birth, gender, and role (Patient or Helper). Patients are also required to enter their type of disability, a medical condition description, and emergency contact details (name, relation, and phone number)",
    "After logging in, users see features based on their role. Patients have access to: 'Create Service Request', 'My Requests', 'My Profile', and 'Payments'. Helpers can access: 'Browse Public Requests', 'My Services', 'Applications', and 'Payments'.",
    "Patients can create public service requests describing what kind of help they need. These requests include a category (like Transportation or Medical Assistance), a description, a proposed budget, and a preferred date and time. Public requests are visible to all registered helpers.",
    "Patients can send direct service requests to specific helpers. This involves selecting a helper from their profile and submitting a detailed private request. The request status can be: Pending, Accepted, Declined, or Completed.",
    "Helpers can create service offers that describe what type of assistance they are willing to provide. This includes selecting a service category, writing a short bio or description, setting their price per hour, and choosing available dates and times. Offers are visible on the helper's profile.",
    "Helpers can view and apply to public service requests posted by patients. When applying, a helper can write a message to the patient and suggest a price. The patient will then review the application and accept or reject it.",
    "When a patient sends a direct request, the selected helper receives an instant notification. The helper can then accept or decline the request. If accepted, the request becomes active and tracked in the system.",
    "The system uses SignalR to deliver real-time notifications to both patients and helpers. Notifications are triggered when service requests are created, helpers apply, statuses are updated, or payments are made. This ensures both sides stay informed instantly.",
    "After a service is completed, the patient is prompted to make a secure payment using Stripe. Payments are recorded in a dedicated table with details including the sender and receiver user IDs, amount, status (Paid, Pending, Failed), and method (Stripe). Payments are linked to either a public or direct service request.",
    "All users can update their profile information at any time. Patients can update their medical condition and emergency contact details. Helpers can edit their service descriptions, availability times, and pricing. This allows both roles to manage their information flexibly."
  ];
  isChatOpen = false;

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }


  private isGreeting(message: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greet => message.toLowerCase().includes(greet));
  }

  private getGreetingResponse(): string {
    const responses = [
      "Hello! Welcome to the Disability Support System. How can I assist you today?",
      "Hi there! How can I help you with the Disability Support System?",
      "Greetings! I'm here to help with disability support services. What do you need?",
      "Hello! What can I help you with today regarding disability support?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  retrieveRelevantChunks(q: string): string[] {
    const lowerQ = q.toLowerCase();
    const keywords = lowerQ.split(" ").filter(w => w.length > 3);
    return this.chunks.filter(chunk =>
      keywords.some(word => chunk.toLowerCase().includes(word))
    );
  }

  buildPrompt(q: string, ctx: string[]): any[] {
    const systemPrompt = `
      You are a helpful assistant for the Disability Support System.
      Only answer questions based on the provided context below.
      If the answer is not in the context, reply:
      "I'm sorry, I don't have enough information to answer that right now."
      Answer clearly and respectfully, as your users may have accessibility needs.
    `.trim();

    return [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Context:\n${ctx.join("\n")}\n\nQuestion: ${q}`
      }
    ];
  }

  async handleAsk(): Promise<void> {
    const q = this.userMessage.trim();
    if (!q) {
      alert("Please enter a question.");
      return;
    }


    this.messages.push({
      text: q,
      sender: 'user',
      timestamp: new Date()
    });


    this.userMessage = '';
    this.scrollToBottom();


    if (this.isGreeting(q)) {
      this.addBotMessage(this.getGreetingResponse());
      return;
    }


    this.loadingRef.nativeElement.style.display = "block";
    this.scrollToBottom();

    const ctx = this.retrieveRelevantChunks(q);

    if (ctx.length === 0) {
      this.addBotMessage("I'm sorry, I couldn't find enough information to answer your question. Please try rephrasing.");
      return;
    }

    const messages = this.buildPrompt(q, ctx);

    try {
      const response = await this.getAIResponse(messages);
      this.addBotMessage(response);
    } catch (error: any) {
      this.addBotMessage(`Error: ${error.message}`);
    }
  }

  private async getAIResponse(messages: any[]): Promise<string> {
    const body = JSON.stringify({
      model: this.MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const res = await fetch(this.ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }

  private addBotMessage(text: string): void {
    this.messages.push({
      text,
      sender: 'bot',
      timestamp: new Date()
    });
    this.loadingRef.nativeElement.style.display = "none";
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }


  formatMessage(text: string): string {

    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }
}
