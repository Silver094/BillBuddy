
export const sendEmail = async (to: string, subject: string, html: string) => {
    // Email service disabled as per user request
    console.log(`[Email Disabled] To: ${to}, Subject: ${subject}`);
    return true;
};

