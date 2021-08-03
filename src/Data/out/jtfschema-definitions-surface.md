# Untitled object in undefined Schema

```txt
undefined#/definitions/surface
```

Surface.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                              |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ----------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [JTFSchema.schema.json\*](JTFSchema.schema.json "open original schema") |

## surface Type

`object` ([Details](jtfschema-definitions-surface.md))

# undefined Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                   |
| :-------------------- | -------- | -------- | -------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| [\_class](#_class)    | `string` | Required | cannot be null | [Untitled schema](jtfschema-definitions-surface-properties-_class.md "undefined#/definitions/surface/properties/\_class")    |
| [type](#type)         | `string` | Required | cannot be null | [Untitled schema](jtfschema-definitions-surface-properties-type.md "undefined#/definitions/surface/properties/type")         |
| [name](#name)         | `string` | Required | cannot be null | [Untitled schema](jtfschema-definitions-surface-properties-name.md "undefined#/definitions/surface/properties/name")         |
| [children](#children) | `array`  | Required | cannot be null | [Untitled schema](jtfschema-definitions-surface-properties-children.md "undefined#/definitions/surface/properties/children") |

## \_class




`_class`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Untitled schema](jtfschema-definitions-surface-properties-_class.md "undefined#/definitions/surface/properties/\_class")

### \_class Type

`string`

### \_class Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^Surface$
```

[try pattern](https://regexr.com/?expression=%5ESurface%24 "try regular expression with regexr.com")

## type




`type`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Untitled schema](jtfschema-definitions-surface-properties-type.md "undefined#/definitions/surface/properties/type")

### type Type

`string`

## name




`name`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Untitled schema](jtfschema-definitions-surface-properties-name.md "undefined#/definitions/surface/properties/name")

### name Type

`string`

## children




`children`

-   is required
-   Type: an array of merged types ([Details](jtfschema-definitions-surface-properties-children-items.md))
-   cannot be null
-   defined in: [Untitled schema](jtfschema-definitions-surface-properties-children.md "undefined#/definitions/surface/properties/children")

### children Type

an array of merged types ([Details](jtfschema-definitions-surface-properties-children-items.md))
