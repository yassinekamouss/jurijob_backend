const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.get('/', (req, res) => {
    res.json({
        message: `
        =====================
        = Hello From Jurijob! =
        =====================
        `,
        status: 200
    });

});


app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}/`);
})