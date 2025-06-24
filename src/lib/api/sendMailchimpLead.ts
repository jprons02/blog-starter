type BenefitLead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  householdSize: number;
  income: string;
  situations: string[];
  payUtility: string;
};

const sendMailchimpLead = async (data: BenefitLead): Promise<Response> => {
  const API_ENDPOINT =
    "https://xjsx1og5tf.execute-api.us-east-1.amazonaws.com/prod/mailchimp";
  const API_KEY = process.env.NEXT_PUBLIC_LAMBDA_BLOG_API_KEY!;

  const res = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(data),
  });

  return res;
};

export default sendMailchimpLead;
