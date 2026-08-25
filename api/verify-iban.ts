// api/verify-iban.ts
export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { iban } = req.body;
    if (!iban) {
        return res.status(400).json({ message: "Missing iban" });
    }

    const apiKey = "ifk_9e52cff5f0e3815faf8120c209ae788ecf07b8967c56c43f28581ce1b44dff7e"; // NOT prefixed with VITE_

    if (!apiKey) {
        return res.status(200).json({ valid: false, message: "IBANforge not configured" });
    }

    try {
        const response = await fetch("https://api.ibanforge.com/v1/iban/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ iban }),
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(502).json({ message: "Upstream request failed" });
    }
}