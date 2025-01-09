<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container { 
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        .container img {
            width: 100%;
            height: auto;
            border-radius: 8px 8px 0 0;
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        label {
            display: block;
            margin-bottom: 10px;
            color: #333;
        }

        input[type="text"],
        input[type="email"],
        select,
        textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        input[type="submit"] {
            width: 100%;
            padding: 12px;
            background-color: #007bff;
            border: none;
            color: white;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #0056b3;
        }

        .success-message {
            color: green;
            font-weight: bold;
            margin-bottom: 20px;
        }
 
        .error-message {
            color: red;
            font-weight: bold;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

    <div class="container">
        <img src="pvformage.jpg" alt="Top Image">
        <h2>Contact Us</h2>

        <form action="pvcontactus.php" method="POST">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="service">Select Service:</label>
            <select id="service" name="service" required>
                <option value="consultation">Consultation</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Website Develpment">Website Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Database Management">Database Management</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Brand Management">Brand Management</option>
                <option value="Digital and Creative Art Products">Digital and Creative Art Products</option>
                <option value="Industrial Printing">Industrial Printing</option>
                <option value="Feedback">Feedback</option>
                <!-- Add more options as needed -->
            </select>

            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="4" required></textarea>

            <input type="submit" name="submit" value="Submit">
        </form>
    </div>
    <div class="rounded-box">
        <h2 style="color:rgb(238, 106, 18);">CLICK TO RETURN TO HOME PAGE</h2>
        <center><p><a href="index.html">Home</a></p></center>
    </div>
    
</body>
</html>
