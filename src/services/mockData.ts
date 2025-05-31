import { Author, Category, Ebook } from '../types';

export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Jane Austen',
    bio: 'English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
    createdAt: '2023-05-12T10:30:00Z',
  },
  {
    id: '2',
    name: 'George Orwell',
    bio: 'English novelist, essayist, journalist, and critic. His work is characterized by lucid prose, social criticism, opposition to totalitarianism, and support of democratic socialism.',
    createdAt: '2023-06-15T14:45:00Z',
  },
  {
    id: '3',
    name: 'Agatha Christie',
    bio: 'English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.',
    createdAt: '2023-07-21T09:15:00Z',
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Fiction',
    description: 'Literary works created from the imagination, not presented as fact, though it may be based on a true story or situation.',
    createdAt: '2023-04-10T08:20:00Z',
  },
  {
    id: '2',
    name: 'Science Fiction',
    description: 'Speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    createdAt: '2023-05-05T11:40:00Z',
  },
  {
    id: '3',
    name: 'Mystery',
    description: 'A genre of fiction that follows a crime (like a murder or a disappearance) from the moment it is committed to the moment it is solved.',
    createdAt: '2023-06-17T16:30:00Z',
  },
  {
    id: '4',
    name: 'Self-Help',
    description: 'Books written with the intention to instruct readers on solving personal problems.',
    createdAt: '2023-07-25T13:10:00Z',
  },
];

export const mockEbooks: Ebook[] = [
  {
    id: '1',
    title: 'Pride and Prejudice',
    description: 'The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of the British Regency.',
    coverImage: 'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    fileUrl: '/ebooks/pride-and-prejudice.pdf',
    authorId: '1',
    categoryIds: ['1'],
    createdAt: '2023-08-03T10:20:00Z',
    updatedAt: '2023-08-03T10:20:00Z',
  },
  {
    id: '2',
    title: '1984',
    description: 'The book is set in 1984 in Oceania, one of three perpetually warring totalitarian states. Winston Smith, a citizen and low-ranking member of the ruling Party, works in the Ministry of Truth, where he is rewriting historical records to conform to the state\'s ever-changing version of history.',
    coverImage: 'https://images.pexels.com/photos/3361486/pexels-photo-3361486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    fileUrl: '/ebooks/1984.pdf',
    authorId: '2',
    categoryIds: ['1', '2'],
    createdAt: '2023-09-15T14:40:00Z',
    updatedAt: '2023-09-17T11:25:00Z',
  },
  {
    id: '3',
    title: 'Murder on the Orient Express',
    description: 'What starts as a lavish train ride through Europe quickly unfolds into one of the most stylish, suspenseful and thrilling mysteries ever told.',
    coverImage: 'https://images.pexels.com/photos/5834346/pexels-photo-5834346.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    fileUrl: '/ebooks/murder-on-the-orient-express.pdf',
    authorId: '3',
    categoryIds: ['1', '3'],
    createdAt: '2023-10-21T09:30:00Z',
    updatedAt: '2023-10-22T16:45:00Z',
  },
];