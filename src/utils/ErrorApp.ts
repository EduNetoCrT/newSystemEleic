export class ErrorApp extends Error {
    status: number;
  
    constructor({ message, status }: { message: string; status: number }) {
      super(message);
      this.status = status;
      this.name = 'ErrorApp';  // Definindo um nome fixo para a classe de erro
      Object.setPrototypeOf(this, ErrorApp.prototype);  // Isso garante que instanceof funcione corretamente
    }
  
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status
      };
    }
  }