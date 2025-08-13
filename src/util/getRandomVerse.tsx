import { bookChapters, type TestamentType } from "../constant/booksInfo.ts";

export interface ChapterPath {
  path: string;
  bookFolder: string;
  chapter: number;
}

export function getRandomChapterPath(testament: TestamentType): ChapterPath {
  const books = bookChapters[testament];
  const bookNames = Object.keys(books);
  const randomBook = bookNames[Math.floor(Math.random() * bookNames.length)];
  const chapterCount = books[randomBook];
  const randomChapter = Math.floor(Math.random() * chapterCount) + 1;

  return {
    path: `/books/${randomBook}/chapters/${randomChapter}.json`,
    bookFolder: randomBook,
    chapter: randomChapter,
  };
}
