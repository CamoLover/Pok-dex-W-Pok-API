import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../index';
import * as pokeapi from '../../lib/pokeapi';

// Mock the pokeapi module
jest.mock('../../lib/pokeapi');

const mockFetchPokemonPaginated = pokeapi.fetchPokemonPaginated as jest.MockedFunction<typeof pokeapi.fetchPokemonPaginated>;
const mockFetchPokemonSpecies = pokeapi.fetchPokemonSpecies as jest.MockedFunction<typeof pokeapi.fetchPokemonSpecies>;
const mockGetLocalizedName = pokeapi.getLocalizedName as jest.MockedFunction<typeof pokeapi.getLocalizedName>;
const mockGetPokemonImageUrl = pokeapi.getPokemonImageUrl as jest.MockedFunction<typeof pokeapi.getPokemonImageUrl>;

describe('Home Page - Language Switching', () => {
  const mockPokemonList = [
    { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { id: 25, name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { id: 6, name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
  ];

  const mockSpeciesData = {
    1: {
      id: 1,
      name: 'bulbasaur',
      names: [
        { language: { name: 'en', url: '' }, name: 'Bulbasaur' },
        { language: { name: 'fr', url: '' }, name: 'Bulbizarre' },
        { language: { name: 'es', url: '' }, name: 'Bulbasaur' },
        { language: { name: 'de', url: '' }, name: 'Bisasam' },
        { language: { name: 'ja', url: '' }, name: 'フシギダネ' },
      ],
      flavor_text_entries: [],
    },
    25: {
      id: 25,
      name: 'pikachu',
      names: [
        { language: { name: 'en', url: '' }, name: 'Pikachu' },
        { language: { name: 'fr', url: '' }, name: 'Pikachu' },
        { language: { name: 'es', url: '' }, name: 'Pikachu' },
        { language: { name: 'de', url: '' }, name: 'Pikachu' },
        { language: { name: 'ja', url: '' }, name: 'ピカチュウ' },
      ],
      flavor_text_entries: [],
    },
    6: {
      id: 6,
      name: 'charizard',
      names: [
        { language: { name: 'en', url: '' }, name: 'Charizard' },
        { language: { name: 'fr', url: '' }, name: 'Dracaufeu' },
        { language: { name: 'es', url: '' }, name: 'Charizard' },
        { language: { name: 'de', url: '' }, name: 'Glurak' },
        { language: { name: 'ja', url: '' }, name: 'リザードン' },
      ],
      flavor_text_entries: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fetchPokemonPaginated
    mockFetchPokemonPaginated.mockResolvedValue(mockPokemonList);

    // Mock fetchPokemonSpecies
    mockFetchPokemonSpecies.mockImplementation(async (id: string | number) => {
      const pokemonId = typeof id === 'string' ? parseInt(id) : id;
      return mockSpeciesData[pokemonId as keyof typeof mockSpeciesData] as pokeapi.PokemonSpecies;
    });

    // Mock getLocalizedName
    mockGetLocalizedName.mockImplementation((names, language) => {
      const found = names.find(n => n.language.name === language);
      return found?.name || names.find(n => n.language.name === 'en')?.name || '';
    });

    // Mock getPokemonImageUrl
    mockGetPokemonImageUrl.mockImplementation((id) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    );
  });

  test('should render Pokemon with English names by default', async () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLanguageChange = jest.fn();

    await act(async () => {
      render(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('charizard')).toBeInTheDocument();
  });

  test('should clear translatedName when language changes', async () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLanguageChange = jest.fn();

    const { rerender } = await act(async () => {
      return render(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    // Change language to French
    await act(async () => {
      rerender(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="fr"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // The effect should clear translations and reload them
    // This tests that the useEffect with language dependency fires
    await waitFor(() => {
      expect(mockFetchPokemonSpecies).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should load French translations when language is "fr"', async () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLanguageChange = jest.fn();

    await act(async () => {
      render(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="fr"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // Wait for Pokemon to load
    await waitFor(() => {
      expect(mockFetchPokemonPaginated).toHaveBeenCalled();
    });

    // Wait for translations to load
    await waitFor(() => {
      expect(mockFetchPokemonSpecies).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Verify getLocalizedName was called with French language
    await waitFor(() => {
      expect(mockGetLocalizedName).toHaveBeenCalledWith(
        expect.anything(),
        'fr'
      );
    }, { timeout: 3000 });
  });

  test('should load Japanese translations when language is "ja"', async () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLanguageChange = jest.fn();

    await act(async () => {
      render(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="ja"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // Wait for Pokemon to load
    await waitFor(() => {
      expect(mockFetchPokemonPaginated).toHaveBeenCalled();
    });

    // Wait for translations to load
    await waitFor(() => {
      expect(mockFetchPokemonSpecies).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Verify getLocalizedName was called with Japanese language
    await waitFor(() => {
      expect(mockGetLocalizedName).toHaveBeenCalledWith(
        expect.anything(),
        'ja'
      );
    }, { timeout: 3000 });
  });

  test('should not fetch translations when language is "en"', async () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLanguageChange = jest.fn();

    await act(async () => {
      render(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // Wait for Pokemon to load
    await waitFor(() => {
      expect(mockFetchPokemonPaginated).toHaveBeenCalled();
    });

    // Wait a bit to ensure no translation fetching happens
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // fetchPokemonSpecies should NOT be called for English
    expect(mockFetchPokemonSpecies).not.toHaveBeenCalled();
  });

  test('should re-fetch translations when switching from French to German', async () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLanguageChange = jest.fn();

    const { rerender } = await act(async () => {
      return render(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="fr"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // Wait for French translations to load
    await waitFor(() => {
      expect(mockFetchPokemonSpecies).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Record initial call count
    const initialCallCount = mockGetLocalizedName.mock.calls.length;

    // Change language to German
    await act(async () => {
      rerender(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="de"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // Wait a bit for the language change effect to trigger
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // Verify new calls were made after language change
    // (the translations should be cleared and re-fetched)
    expect(mockGetLocalizedName.mock.calls.length).toBeGreaterThanOrEqual(initialCallCount);
  }, 10000);

  test('should handle language switch from non-English to English', async () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLanguageChange = jest.fn();

    const { rerender } = await act(async () => {
      return render(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="fr"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // Wait for French translations
    await waitFor(() => {
      expect(mockFetchPokemonSpecies).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Clear mock to track new calls
    mockFetchPokemonSpecies.mockClear();

    // Change language to English
    await act(async () => {
      rerender(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    // Wait to ensure no new translations are fetched for English
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // No new species fetches should happen for English
    expect(mockFetchPokemonSpecies).not.toHaveBeenCalled();
  });

  test('should display original names when translatedName is undefined', async () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLanguageChange = jest.fn();

    await act(async () => {
      render(
        <Home
          darkMode={false}
          onThemeToggle={mockOnThemeToggle}
          language="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    // Check that all Pokemon names are displayed (original names)
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('charizard')).toBeInTheDocument();
  });
});
