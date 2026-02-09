//BasenameService.js
export default class BasenameService {

  constructor(basenameController, className) {
    this.basename = basenameController
    this.className = className
  }

  async findByPrefix(prefix) {
    const rows = await this.basename.findLikeInClass(
      prefix,
      this.className
    )

    if (!rows || !rows.length) return null

    if (rows.length === 1) return rows[0]

    return rows.sort((a, b) => a.name.length - b.name.length)[0]
  }

}
