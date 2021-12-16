import axios from 'axios'

export default async (req, res) => {
    try {
        const { data } = await axios.post(`${process.env.TELEGRAM_PUBLIC_URL}`, {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: req.body.message,
            parse_mode: "HTML"
        })

        if (!data.ok) {
            return res.status(400).json('Sending message failed')
        }

        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json('Server Error')
    }
}