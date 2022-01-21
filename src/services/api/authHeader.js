export default function authHeader() {
  let user = JSON.parse(localStorage.getItem('user'));
  //console.log(user);

  if (user)
    return { 'x-access-token': `${user}` };
  else
    return {};
}