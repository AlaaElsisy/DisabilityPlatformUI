

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
  @ViewChild('chatBox') chatBox!: ElementRef;
  userText: string = '';

  HF_TOKEN = '';
  API_URL = 'https://router.huggingface.co/together/v1/chat/completions';
  MODEL_ID = 'mistralai/Mixtral-8x7B-Instruct-v0.1';
  MAX_HISTORY = 10;

  messages: any[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant for the Disability Support System...'
    }
  ];

  constructor(private http: HttpClient) {}

  appendMessage(role: string, content: string) {
    const msg = document.createElement('div');
    msg.className = `messageDiv ${role === 'user' ? 'user-message' : 'bot-message'}`;
    msg.textContent = content;
    this.chatBox.nativeElement.appendChild(msg);
    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
  }

  handleUserInput() {
    if (!this.userText.trim()) return;

    const userMessage = this.userText;
    this.appendMessage('user', userMessage);
    this.messages.push({ role: 'user', content: userMessage });
    this.userText = '';

    const loading = document.createElement('div');
    loading.className = 'messageDiv bot-message';
    loading.textContent = 'Loading...';
    this.chatBox.nativeElement.appendChild(loading);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.HF_TOKEN}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: this.MODEL_ID,
      messages: this.messages,
      temperature: 0.7,
      max_tokens: 256
    };

    this.http.post<any>(this.API_URL, body, { headers }).subscribe({
      next: res => {
        loading.remove();
        const reply = res.choices[0]?.message?.content || 'No reply.';
        this.appendMessage('bot', reply);
        this.messages.push({ role: 'assistant', content: reply });

        if (this.messages.length > this.MAX_HISTORY * 2 + 1) {
          this.messages.splice(1, 2);
        }
      },
      error: err => {
        console.error('API error', err);
        loading.textContent = 'Error occurred';
        this.appendMessage('bot', 'Sorry, an error happened.');
      }
    });
  }
}