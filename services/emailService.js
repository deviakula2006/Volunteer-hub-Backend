const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.sendGroupInvite = async (to, groupName, inviteLink, isNewUser) => {
    const subject = `Invitation to join ${groupName} on VolunteerHub`;

    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #3b82f6;">You're Invited!</h2>
            <p>Hello,</p>
            <p>You have been invited to join the volunteer group <strong>${groupName}</strong> on VolunteerHub.</p>
            ${isNewUser
            ? `<p>It looks like you don't have an account yet. Please register first, then you can join the group.</p>`
            : `<p>Click the button below to join the team and start coordinating!</p>`
        }
            <div style="margin: 30px 0;">
                <a href="${inviteLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    ${isNewUser ? 'Register & Join' : 'Join Group Now'}
                </a>
            </div>
            <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #3b82f6; font-size: 14px;">${inviteLink}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">This invitation was sent from VolunteerHub.</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"VolunteerHub" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
