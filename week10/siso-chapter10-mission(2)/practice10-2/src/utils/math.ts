export const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  for (let i = 3; i * i <= num; i++) {
    //(a, b)
    //(a, b)=n, 두 약수 중 하나는 반드시 sqrt(n) 이하에 존재
    //i*i

    //0(n)->0(sqrt(n))
    if (num % i === 0) return false;
  }

  return true;
};

export const findPrimeNumbers = (max: number) => {
  /*
  const PrimeNumbers = [];

  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) PrimeNumbers.push(i);
  }

  return PrimeNumbers;
  */

  const sieve = Array(max + 1).fill(true);
  sieve[0] = sieve[1] = false;

  for (let i = 2; i * i <= max; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= max; j += i) {
        sieve[j] = false;
      }
    }
  }

  return sieve.map((isPrime, i) => (isPrime ? i : null)).filter(Boolean);
};
