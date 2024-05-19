import axios from "axios";

require('dotenv').config();

const url = 'https://www.boredapi.com/api/activity';

type IdeaView = {
    activity: string;
    accessibility: number;
    type: IdeaType;
    participants: number;
    price: number;
    key: number;
}

enum IdeaType {
    education = "education",
    recreational = "recreational",
    social = "social",
    diy = "diy",
    charity = "charity",
    cooking = "cooking",
    relaxation = "relaxation",
    music = "music",
    busywork = "busywork",
}

export async function getIdea(): Promise<String> {
    const response = await axios.get(url);

    const rawResponse: IdeaView = response.data;
    const formattedResponse = formatResponse(rawResponse);

    return formattedResponse;
}

async function formatResponse(idea: IdeaView): Promise<String> {
    let responseString = `Idea: ${idea.activity}\n`;
    responseString += `Accessibility: ${idea.accessibility}\n`;
    responseString += `Type: ${idea.type}\n`;
    responseString += `Participants: ${idea.participants}\n`;

    // TODO: Add text description for price (0 - free, 1 - expensive)
    if (idea.price === 0) {
        responseString += `Price: Free\n`;
    } else {
        responseString += `Price: ${idea.price}\n`;
    }

    // TODO: Add translation for other languages
    // const translatedText = await translateText(responseString);
    // if (translatedText) {
    //     return translatedText;
    // }
    return responseString;     
}

async function translateText(text: String): Promise<String> {
    const options = {
        method: 'POST',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPID_API_KEY as string,
          'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
        },
        data: {
            q: text,
            source: 'en',
            target: 'ru',
        }
      };
      
      try {
          const response = await axios.request(options);
          console.log({res: response.data});
          return response.data.data.translations.translatedText as string;
      } catch (error) {
          console.error(error);
          return text;
      }
}