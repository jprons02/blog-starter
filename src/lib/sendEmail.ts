const sendEmail = async ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => {
  const API_ENDPOINT =
    "https://xjsx1og5tf.execute-api.us-east-1.amazonaws.com/prod/contact";
  const API_KEY = process.env.NEXT_PUBLIC_LAMBDA_EMAIL_API_KEY!;

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ name, email, message }),
  });

  return response;
};

export default sendEmail;
