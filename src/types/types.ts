export interface User {
    name: string;
    email: string;
  }
  
  type Paragraph = {
    paragraph: number;
    refined_text: string;
  };
  
  type Page = {
    original_text: string;
    page: number;
    paragraphs: Paragraph[];
    refined_text: string;
  };
  
  export interface Document  {
    document_id: string;
    filename: string;
    pages: Page[];
    username: string;
  };
  
  export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }
  
  export interface QueryResult {
    answer: string;
    citations: {
      document_id: string;
      document_name: string;
      page: number;
      paragraph: number;
      text: string;
    }[];
  }
  
  export interface Theme {
    id: string;
    title: string;
    description: string;
    documents: string[];
    supportingText: {
      document: string;
      page: number;
      text: string;
    }[];
  }