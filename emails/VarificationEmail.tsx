import {
  HTML,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <HTML>
      <Head>
        <title>Verification Email Code</title>
        <Font
          fontFamily="Arial"
          fallbackFontFamily="sans-serif"
          fontWeight="400"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Arial:wght@400&display=swap',
            format: 'woff2',
          }}
        />
      </Head>
      <Preview>Verify your email address</Preview>
      <Section
        style={{
          padding: '20px',
          backgroundColor: '#f4f4f4',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Row>
          <Heading style={{ textAlign: 'center', color: '#333' }}>
            Email Verification
          </Heading>
        </Row>

        <Row>
          <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.5' }}>
            Hi {username},<br />
            Thank you for registering with us! To complete your registration,
            please verify your email address by entering the following OTP code:
          </Text>
        </Row>

        <Row>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              margin: '20px 0',
            }}
          >
            {otp}
          </Text>
        </Row>

        <Row>
          <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.5' }}>
            If you did not request this verification, please ignore this email.
          </Text>
        </Row>

        <Row>
          <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.5' }}>
            Thank you,<br />
            The Feedback Team
          </Text>
        </Row>

        <Row>
          <Text
            style={{
              textAlign: 'center',
              color: '#999',
              fontSize: '12px',
              marginTop: '20px',
            }}
          >
            &copy; {new Date().getFullYear()} Feedback Web Application. All rights
            reserved.
          </Text>
        </Row>
      </Section>
    </HTML>
  );
}
