import { getLocalizedName, getLocalizedFlavorText } from '../pokeapi';

describe('getLocalizedName', () => {
  const mockNames = [
    { language: { name: 'en', url: '' }, name: 'Pikachu' },
    { language: { name: 'fr', url: '' }, name: 'Pikachu (FR)' },
    { language: { name: 'es', url: '' }, name: 'Pikachu (ES)' },
    { language: { name: 'de', url: '' }, name: 'Pikachu (DE)' },
    { language: { name: 'ja', url: '' }, name: 'ピカチュウ' },
  ];

  test('should return English name when language is "en"', () => {
    const result = getLocalizedName(mockNames, 'en');
    expect(result).toBe('Pikachu');
  });

  test('should return French name when language is "fr"', () => {
    const result = getLocalizedName(mockNames, 'fr');
    expect(result).toBe('Pikachu (FR)');
  });

  test('should return Spanish name when language is "es"', () => {
    const result = getLocalizedName(mockNames, 'es');
    expect(result).toBe('Pikachu (ES)');
  });

  test('should return German name when language is "de"', () => {
    const result = getLocalizedName(mockNames, 'de');
    expect(result).toBe('Pikachu (DE)');
  });

  test('should return Japanese name when language is "ja"', () => {
    const result = getLocalizedName(mockNames, 'ja');
    expect(result).toBe('ピカチュウ');
  });

  test('should fallback to English when requested language is not available', () => {
    const result = getLocalizedName(mockNames, 'zh');
    expect(result).toBe('Pikachu');
  });

  test('should return English when language parameter is invalid', () => {
    const result = getLocalizedName(mockNames, 'invalid-lang');
    expect(result).toBe('Pikachu');
  });

  test('should handle empty names array gracefully', () => {
    const result = getLocalizedName([], 'en');
    expect(result).toBe('');
  });

  test('should return empty string when no English fallback exists', () => {
    const noEnglishNames = [
      { language: { name: 'fr', url: '' }, name: 'Pikachu (FR)' },
    ];
    const result = getLocalizedName(noEnglishNames, 'es');
    expect(result).toBe(''); // Returns empty string when requested language not found and no English fallback
  });
});

describe('getLocalizedFlavorText', () => {
  const mockFlavorTexts = [
    { flavor_text: 'Electric mouse Pokemon', language: { name: 'en', url: '' } },
    { flavor_text: 'Pokemon souris électrique', language: { name: 'fr', url: '' } },
    { flavor_text: 'Pokémon ratón eléctrico', language: { name: 'es', url: '' } },
    { flavor_text: 'Elektro-Maus-Pokemon', language: { name: 'de', url: '' } },
    { flavor_text: 'でんきねずみポケモン', language: { name: 'ja', url: '' } },
  ];

  test('should return English flavor text when language is "en"', () => {
    const result = getLocalizedFlavorText(mockFlavorTexts, 'en');
    expect(result).toBe('Electric mouse Pokemon');
  });

  test('should return French flavor text when language is "fr"', () => {
    const result = getLocalizedFlavorText(mockFlavorTexts, 'fr');
    expect(result).toBe('Pokemon souris électrique');
  });

  test('should return Spanish flavor text when language is "es"', () => {
    const result = getLocalizedFlavorText(mockFlavorTexts, 'es');
    expect(result).toBe('Pokémon ratón eléctrico');
  });

  test('should return German flavor text when language is "de"', () => {
    const result = getLocalizedFlavorText(mockFlavorTexts, 'de');
    expect(result).toBe('Elektro-Maus-Pokemon');
  });

  test('should return Japanese flavor text when language is "ja"', () => {
    const result = getLocalizedFlavorText(mockFlavorTexts, 'ja');
    expect(result).toBe('でんきねずみポケモン');
  });

  test('should fallback to English when requested language is not available', () => {
    const result = getLocalizedFlavorText(mockFlavorTexts, 'zh');
    expect(result).toBe('Electric mouse Pokemon');
  });

  test('should handle empty flavor texts array gracefully', () => {
    const result = getLocalizedFlavorText([], 'en');
    expect(result).toBe('');
  });

  test('should return empty string when no English fallback exists', () => {
    const noEnglishTexts = [
      { flavor_text: 'Pokemon souris électrique', language: { name: 'fr', url: '' } },
    ];
    const result = getLocalizedFlavorText(noEnglishTexts, 'es');
    expect(result).toBe(''); // Returns empty string when requested language not found and no English fallback
  });
});
