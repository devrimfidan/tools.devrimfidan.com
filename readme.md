# Tools Directory

A simple and maintainable directory of tools and services, built with vanilla JavaScript and JSON data storage.

## Credits

This project is inspired by [Riley Egger's Card Filter Pattern](https://codepen.io/eggeriley/pen/JjePxRm) on CodePen. We've extended the original design with additional features like JSON-based data management and rating system.

## Features

- Filter tools by category
- Search functionality
- Responsive design
- Easy to maintain through JSON data
- GitHub Pages ready

## Structure

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── data/
│   └── tools.json
└── README.md
```

## How to Add/Edit Tools

1. Open `data/tools.json`
2. Add or edit tool entries following this format:

```json
{
  "name": "Tool Name",
  "url": "https://tool-url.com",
  "description": "Tool description",
  "categories": ["category1", "category2"],
  "rating": 4.5,
  "pricing": "Free/Premium/Enterprise"
}
```

Available categories:
- Product Management
- UI/UX Design
- Prototyping
- User Research
- Collaboration
- Documentation
- Brainstorming
- Customer Feedback
- Analytics
- Development Tools

## Deployment

Simply push to GitHub and enable GitHub Pages in your repository settings.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request



