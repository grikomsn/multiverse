import { sanity } from "../sanity"
import { fetchCoverLetters, fetchResume, type CoverLetter, type Resume } from "./resume"

/** One fetch per build, shared by every page and endpoint. */
let resume: Promise<Resume> | undefined
let coverLetters: Promise<CoverLetter[]> | undefined

export function getResume(): Promise<Resume> {
  return (resume ??= fetchResume(sanity))
}

export function getCoverLetters(): Promise<CoverLetter[]> {
  return (coverLetters ??= fetchCoverLetters(sanity))
}
