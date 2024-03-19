export class ChatMessage {
  constructor(public text: string) {}
  
  toJSON() {
    return {
      text: this.text
    }
  }
}