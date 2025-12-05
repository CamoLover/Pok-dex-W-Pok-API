// Mapping between English type names (from PokeAPI) and French image file names
export const typeImageMap: { [key: string]: string } = {
  normal: 'Type_Normal.png',
  fire: 'Type_Feu.png',
  water: 'Type_Eau.png',
  electric: 'Type_Electrique.png',
  grass: 'Type_Plante.png',
  ice: 'Type_Glace.png',
  fighting: 'Type_Combat.png',
  poison: 'Type_Poison.png',
  ground: 'Type_Sol.png',
  flying: 'Type_Vol.png',
  psychic: 'Type_Psy.png',
  bug: 'Type_Insect.png',
  rock: 'Type_Roche.png',
  ghost: 'Type_Spectre.png',
  dragon: 'Type_Dragon.png',
  dark: 'Type_Tenebre.png',
  steel: 'Type_Acier.png',
  fairy: 'Type_Fee.png',
};

export function getTypeImageUrl(typeName: string): string {
  const imageName = typeImageMap[typeName.toLowerCase()];
  return imageName ? `/images/types/${imageName}` : '';
}

export function getTypeColor(type: string): string {
  const typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  
  return typeColors[type] || '#68A090';
}