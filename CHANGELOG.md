# Changelog
 
All notable changes to this project should and will be documented in this file.
 
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
 
## [Unreleased]
 
### Added
- Filter books by genre on the list page (#67)
 
## [1.2.0] - 2025-04-28
 
### Added
- Late return penalty calculation (#45)
- PDF export for member fiches (#52)
- Email notifications for overdue loans (#58)
 
### Changed
- Loan duration default changed from 7 to 14 days (#48)
- Improved performance on book search (cache enabled) (#54)
 
### Fixed
- Login form validation on Safari (#50)
- Race condition on simultaneous loan creation (#56)
 
### Security
- Updated bcrypt to v5.1.1 (CVE-2024-XXXXX)
 
## [1.1.0] - 2025-04-15
 
### Added
- Member management (#23)
- Search books by ISBN (#28)
 
## [1.0.0] - 2025-04-01
 
### Added
- Initial release with book CRUD
- User authentication
- Basic loan/return functionality
 
[Unreleased]: https://github.com/user/minilib/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/user/minilib/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/user/minilib/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/user/minilib/releases/tag/v1.0.0
