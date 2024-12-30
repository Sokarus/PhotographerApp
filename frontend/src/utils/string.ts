const Transliterate = (input: string, readable: boolean = false): string => {
  const map: {[key: string]: string} = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ' ': readable ? ' ' : '_',
  };

  const result = input
    .toLowerCase()
    .split('')
    .map((char) => (map[char] !== undefined ? map[char] : char))
    .join('');

  return readable ? result.charAt(0).toUpperCase() + result.slice(1) : result;
};

export {Transliterate};
