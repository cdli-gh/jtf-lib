# JTF Format Documentation

JTF is a JSON-based format to store and process textual cuneiform data and metadata.

## Tools

## Structure

### Metadata
  - [ ] Metadata
    - [ ] ID
      - [x] P-Number
      - [ ] Other IDs and references
     - [ ] Language(s)
       - [x] Basic
       - [ ] Multilingual
     - [ ] Classification (e.g. genre)
     - [ ] Bibliography
     - [ ] Other metadata

### Transliteration

#### Medium

##### Object
The `object` class describes the physical medium that bears the inscription.

Mandatory attributes:
- `_class: 'object'`
- `type: <*object type*>`
  - [CDLI](https://cdli.ucla.edu/?q=cdli-search-information#object_type): tablet, tablet & envelope, bulla, tag, prism, barrel, cylinder, brick, cone, sealing, seal, and others.

Optional attributes:
- `children`: <`surface`> | <`modifier`>

#### Layout

##### Surface
- `children` (columns): <`column`> | <`modifier`> | <`seal impression`>
- `children` (no columns): <`line`> | <`modifier`> | <`seal impression`>

##### Column
- `children`: <`line`> | <`modifier`> | <`seal impression`>

##### Field

##### Ruling

#### Meta

##### Modifier

(e.g. missing or blank lines)

##### Seal impression

- [x] Basic
- [ ] Linked

##### Commentary

- [x] Plain
- [ ] More (?)
  - [ ] Rich text formatting (e.g. MD / RST / TeX)
  - [ ] References
  - [ ] Text citations

##### Translation

##### Annotation
- [ ] Linguistic
- [ ] Text structure
- [ ] Image mapping
- [ ] Custom

##### Line

#### Inline

##### Sequence

##### Character

###### Standard cuneiform

**Syllabic**

**Logographic**

some text
- Basic
- Language-specific (e.g. Akkadograms in Hittite)

**Determinative**

**Numeric**

**Punctuation**

**Undefined**

###### Grapheme description language (GDL)

- [x] GDL
  - [x] Group
  - [x] Character
  - [x] Modifier

###### Sign list references

- [x] Sign list reference
  - [x] Classical sign lists (ABZ, BAU, HZL, KWU, LAK, MEA, MZL, REC, RSP, ZATU, UET2)
  - [x] CDLI Proto-Cuneiform
  - [x] CDLI Proto-Elamite

###### Non-cuneiform characters

- [ ] Non-cuneifrom
  - [ ] Ugaritic
  - [ ] Alphabetic
    - [ ] West Semitic
    - [ ] Greek
  - [ ] Old Persian
  - [ ] Others (? Egyptian, Luwian, Harrapan etc.)

##### Other inline elements

- [x] Break
- [ ] Gloss

### Sort out:

- [ ] Language shift
- [ ] Text direction (non-standard)

  - [ ] Additional data
    - [ ] Standardized fields for new data types
- [ ] Versioning
- [ ] Format documentation
- [ ] (L)LOD guidelines
