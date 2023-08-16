
type ApiMessage = {
  role: "assistant" | "user";
  content: string;
}
export type GPTAPIError = {
  code: "invalid_api_key"
  message: string
  param: null | string
  type: "invalid_request_error" | string
}

type GPTChoice = {
  finish_reason: "stop" | string;
  index: number
  message: {
    content: string
    role: "assistant" | "user"
  }
}

export interface GTPRes {
  choices: GPTChoice[]
  created: number
  id: string
  model: "gpt-3.5-turbo-0613" | string
  object: "chat.completion"
  usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  }
}

class GPTAPI {
  API_KEY: string;
  constructor(apiKey: string) {
    this.API_KEY = apiKey;
  }
  processMessageToChatGPT = async (message: string) => {
    const apiMessages: ApiMessage[] = [
      { role: 'assistant', content: message }
    ]

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      // "model": "gpt-4-0613	",
      "messages": [
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + this.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    const data = await response.json();
    if(data.choices) {
      return data as GTPRes;
    } else {
      throw data as GPTAPIError
    }
  }
}

export default GPTAPI;
