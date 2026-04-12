const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testPrediction() {
    try {
        const formData = new FormData();
        // Create an empty dummy file
        const p = path.join(__dirname, 'uploads', 'dummy.jpg');
        fs.writeFileSync(p, Buffer.from("this is a test"));
        formData.append('image', fs.createReadStream(p));

        const res = await axios.post('http://localhost:8000/predict', formData, {
            headers: formData.getHeaders()
        });
        console.log("Success:", res.data);
    } catch (err) {
        if (err.response) {
            console.error("Python Error Data:", err.response.data);
            console.error("Python Error HTTML:", err.response.status);
        } else {
            console.error("Axios Error:", err.message);
        }
    }
}
testPrediction();
