const express = require('express');
const app = express();
// get the port from environment variable or use 3000 as default
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json(
        {
            message: "Hello From Jurijob!",
            status: 200
        }
    )
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}/`);
})