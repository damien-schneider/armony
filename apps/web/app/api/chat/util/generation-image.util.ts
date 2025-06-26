import { createServerClient } from "@workspace/supabase/server";
import { experimental_generateImage, type ImageModel, tool } from "ai";
import { v4 } from "uuid";
import { z } from "zod";
export const generateImageTool = ({
  idUser,
  imageModel,
}: {
  idUser: string;
  imageModel: ImageModel;
}) => {
  return {
    generateImage: tool({
      description:
        "Generate a single image based on the prompt. This tool should be used only once per request.",
      parameters: z.object({
        prompt: z.string().describe("The prompt to generate the image from"),
      }),
      execute: async ({ prompt }) => {
        const supabase = await createServerClient();
        const { image } = await experimental_generateImage({
          model: imageModel,
          prompt,
          size: "1024x1024",
          n: 1,
        });
        const generatedUuid = v4();
        const imagePath = `${idUser}/${generatedUuid}.png`;

        const { data, error } = await supabase.storage
          .from("generated-images")
          .upload(`${imagePath}`, image.uint8Array, {
            contentType: "image/png",
          });
        if (error) {
          console.error("Error uploading image to Supabase:", error);
          throw new Error(`Error uploading image: ${error.message}`);
        }
        console.log("Image uploaded successfully:", data);
        return { id: generatedUuid, prompt, imagePath };
      },
    }),
  };
};
