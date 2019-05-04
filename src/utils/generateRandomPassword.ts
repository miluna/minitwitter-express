export default function generateRandomPassword(length = 10): string{
    return [...Array(length)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
}
