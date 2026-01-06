export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
  };
  cries: {
    latest: string;
    legacy: string;
  };
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  names: Array<{
    language: {
      name: string;
      url: string;
    };
    name: string;
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
}

export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}

export interface ChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: ChainLink[];
}

export interface Move {
  id: number;
  name: string;
  names: Array<{
    language: {
      name: string;
      url: string;
    };
    name: string;
  }>;
  power: number | null;
  pp: number;
  accuracy: number | null;
  type: {
    name: string;
    url: string;
  };
  damage_class: {
    name: string;
    url: string;
  };
}

const BASE_URL = 'https://pokeapi.co/api/v2';

class PokeApiCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new PokeApiCache();

async function fetchWithCache(url: string): Promise<any> {
  const cached = cache.get(url);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch (error) {
    console.error('Error fetching from PokéAPI:', error);
    throw error;
  }
}

export async function fetchAllPokemon(): Promise<PokemonListItem[]> {
  try {
    const response: PokemonListResponse = await fetchWithCache(`${BASE_URL}/pokemon?limit=1302`);

    return response.results.map((pokemon, index) => ({
      name: pokemon.name,
      url: pokemon.url,
      id: index + 1
    }));
  } catch (error) {
    console.error('Error fetching all Pokemon:', error);
    return [];
  }
}

export async function fetchPokemonPaginated(offset: number = 0, limit: number = 60): Promise<PokemonListItem[]> {
  try {
    const response: PokemonListResponse = await fetchWithCache(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);

    return response.results.map((pokemon) => ({
      name: pokemon.name,
      url: pokemon.url,
      id: extractIdFromUrl(pokemon.url)
    }));
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return [];
  }
}

export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const url = `${BASE_URL}/pokemon/${idOrName}`;
  return await fetchWithCache(url);
}

export async function fetchPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
  const url = `${BASE_URL}/pokemon-species/${idOrName}`;
  return await fetchWithCache(url);
}

export async function fetchMove(idOrName: string | number): Promise<Move> {
  const url = `${BASE_URL}/move/${idOrName}`;
  return await fetchWithCache(url);
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  return await fetchWithCache(url);
}

export function flattenEvolutionChain(chain: ChainLink): Array<{ name: string; id: number }> {
  const result: Array<{ name: string; id: number }> = [];

  function traverse(link: ChainLink) {
    const id = extractIdFromUrl(link.species.url);
    result.push({ name: link.species.name, id });

    link.evolves_to.forEach(evolution => traverse(evolution));
  }

  traverse(chain);
  return result;
}

export function getPokemonImageUrl(id: number, isShiny: boolean = false, isBack: boolean = false): string {
  const shinyPath = isShiny ? 'shiny/' : '';
  const direction = isBack ? 'back/' : '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${direction}${id}.png`;
}

export function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1]) : 0;
}

export function getLocalizedName(names: Array<{ language: { name: string }; name: string }>, language: string): string {
  const langMap: { [key: string]: string } = {
    'en': 'en',
    'fr': 'fr', 
    'es': 'es',
    'de': 'de',
    'ja': 'ja'
  };

  const targetLang = langMap[language] || 'en';
  const localizedName = names.find(name => name.language.name === targetLang);
  
  return localizedName?.name || names.find(name => name.language.name === 'en')?.name || '';
}

export function getLocalizedFlavorText(
  flavorTexts: Array<{ flavor_text: string; language: { name: string } }>, 
  language: string
): string {
  const langMap: { [key: string]: string } = {
    'en': 'en',
    'fr': 'fr',
    'es': 'es', 
    'de': 'de',
    'ja': 'ja'
  };

  const targetLang = langMap[language] || 'en';
  const localizedText = flavorTexts.find(text => text.language.name === targetLang);
  
  return localizedText?.flavor_text || 
         flavorTexts.find(text => text.language.name === 'en')?.flavor_text || 
         '';
}