// server.js
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 静态文件服务 - 托管 public 文件夹
app.use(express.static(path.join(__dirname, 'public')));

// ============ 页面路由（可选，用于美化 URL） ============
// 以下路由使得用户访问 /about 而不是 /about.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'team.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// ============ 联系表单 API ============
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // 基本验证
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide name, email, and message.' 
        });
    }

    // 邮箱格式简单验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide a valid email address.' 
        });
    }

    try {
        // 创建邮件传输器
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 邮件内容
        const mailOptions = {
            from: `"B+W Builders Website" <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_TO,
            replyTo: email, // 回复时直接回复给客户
            subject: `New Contact Form Message: ${subject || 'General Inquiry'}`,
            text: `
                You have received a new message from the B+W Builders website.

                Name: ${name}
                Email: ${email}
                Phone: ${phone || 'Not provided'}
                Subject: ${subject || 'Not provided'}

                Message:
                ${message}

                ---
                This message was sent from the contact form on B+W Builders website.
            `,
            html: `
                <h2>New Contact Form Message</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
                <hr>
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p style="color: #888; font-size: 12px;">This message was sent from the contact form on B+W Builders website.</p>
            `
        };

        // 发送邮件
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully from ${email}`);

        res.status(200).json({ 
            success: true, 
            message: 'Your message has been sent successfully. We will get back to you soon!' 
        });

    } catch (error) {
        console.error('❌ Email sending error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message. Please try again later.' 
        });
    }
});

// ============ 404 处理 ============
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    // 如果你还没有 404.html，可以先用下面这行
    // res.status(404).send('<h1>404 - Page Not Found</h1><p><a href="/">Return to Home</a></p>');
});

// ============ 启动服务器 ============
app.listen(PORT, () => {
    console.log(`🚀 B+W Builders server is running at http://localhost:${PORT}`);
    console.log(`📧 Email configured for: ${process.env.EMAIL_USER}`);
});