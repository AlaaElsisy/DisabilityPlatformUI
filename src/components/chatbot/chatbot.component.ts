

import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule,FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})

export class ChatbotComponent {
  @ViewChild('questionInput') questionInput!: ElementRef<HTMLInputElement>;
  @ViewChild('loading') loadingRef!: ElementRef<HTMLElement>;
  @ViewChild('responseBox') responseBox!: ElementRef<HTMLElement>;

  OPENAI_API_KEY: string = "";
  PROVIDER: string = "together";
  MODEL: string = "mistralai/Mixtral-8x7B-Instruct-v0.1";
  ENDPOINT: string = `https://router.huggingface.co/${this.PROVIDER}/v1/chat/completions`;

  chunks: string[] = [
   "The Disability Management System allows users with disabilities to register, search for support providers, and communicate with caregivers.",
  "Support providers can create offers and receive requests from users through the platform.",
  "The system includes a chatbot to assist users with frequently asked questions and navigation help.",
  "Users can filter offers by type of disability, location, and service type.",
  "Each offer includes details like provider name, service description, and availability dates.",
  "Notifications are sent to users when new offers match their needs.",
  "Admins can manage users, providers, and review feedback submitted on services.",
  "The platform supports real-time messaging using SignalR between users and providers."
  ];

  retrieveRelevantChunks(q: string): string[] {
    const lower = q.toLowerCase();
    return this.chunks.filter(
      (chunk) =>
        chunk.toLowerCase().includes("tesla") ||
        (lower.includes("revenue") && lower.includes("revenue")) ||
        (lower.includes("income") && lower.includes("income"))
    );
  }

  buildPrompt(q: string, ctx: string[]): any[] {
    return [
      {
        role: "system",
        content:
          "You are a helpful assistant that answers questions based on the provided context.",
      },
      {
        role: "user",
        content: `Context:\n${ctx.join("\n")}\n\nQuestion: ${q}`,
      },
    ];
  }

  async handleAsk(): Promise<void> {
    const q = this.questionInput.nativeElement.value.trim();
    if (!q) {
      alert("Please enter a question.");
      return;
    }

    this.responseBox.nativeElement.innerText = "";
    this.loadingRef.nativeElement.innerHTML = `<span id="spinner"></span> Thinking...`;
    this.loadingRef.nativeElement.style.display = "block";

    const ctx = this.retrieveRelevantChunks(q);
    const messages = this.buildPrompt(q, ctx);

    const body = JSON.stringify({
      model: this.MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    try {
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
        throw new Error(`Error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      this.responseBox.nativeElement.innerText = data.choices[0].message.content;
    } catch (error: any) {
      this.responseBox.nativeElement.innerText = `Error: ${error.message}`;
    } finally {
      this.loadingRef.nativeElement.style.display = "none";
    }
  }
}
