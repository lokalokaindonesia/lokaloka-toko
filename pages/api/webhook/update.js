export default async (req, res) => {
    if (req.body.model == 'transaction' && req.body.entry.paymentStatus == 'PAID') {
        return res.json({ message: 'updated' })
    }
    return res.json(req.body)
}