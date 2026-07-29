import { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import process from "node:process";

const ses = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }


    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "Faltan datos para enviar el correo.",
        });
    }
    try {
        const command = new SendEmailCommand({
            Source: process.env.SES_FROM_EMAIL!,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Text: {
                        Data: message,
                    },
                },
            },
        });
        console.log({
            from: process.env.SES_FROM_EMAIL,
            to,
            subject,
        });

        const result = await ses.send(command);

        console.log("===== SES RESULT =====");
        console.log(result);
        console.log("MessageId:", result.MessageId);

        return res.status(200).json({
            success: true,
            message: "Correo enviado correctamente",
        });
    } catch (error) {
        console.error("AWS SES Error:", error);

        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : String(error),
        });
    }
}


export const config = {
    api: {
        bodyParser: true,
    },
};