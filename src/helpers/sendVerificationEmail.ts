import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VarificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { url } from "inspector";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Feedback  | Email Verification",
            react: VerificationEmail({ username, otp: verifyCode }),

            // Using the VerificationEmail component to render the email content
            // Ensure that the VerificationEmail component is properly imported
            // and that it accepts the necessary props.
            // The VerificationEmail component should be defined in the emails folder.
            // It should return a valid JSX element that represents the email content.
        });

        return {
            success: true,
            message: "Verification email sent successfully.",
            isAcceptingMessages: true,
            messages: [],
        };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return {
            success: false,
            message: "Failed to send verification email.",
            isAcceptingMessages: false,
            messages: [],
        };
    }
}