import { TwitterApi } from 'twitter-api-v2';
// const client = new Twitter({
//   consumer_key: 'YOUR_CONSUMER_KEY',
//   consumer_secret: 'YOUR_CONSUMER_SECRET',
//   access_token_key: 'YOUR_ACCESS_TOKEN_KEY',
//   access_token_secret: 'YOUR_ACCESS_TOKEN_SECRET',
// });
const client = new TwitterApi('<YOUR_APP_USER_TOKEN>');

// Tell typescript it's a readonly app
const readOnlyClient = client.readOnly;
export const searchTwitter = async (tokenName: string, networkName: string = 'solana') => {
  const result = await client.v2.get('tweets/search', {
    query: `${networkName} AND (${tokenName})`,
    max_results: 100,
  });
  console.log(result.data); // TweetV2[]
  return result.data;
};
