export const config={
  "id": "photos",
  "repo": "photo-album-template",
  "title": "Collected Light",
  "heading": "Keep the little moments.",
  "intro": "A sample album for pictures, the stories beside them and the people you choose to share them with.",
  "noun": "photo",
  "plural": "photos",
  "titleField": "title",
  "publishing": true,
  "fields": [
    {
      "key": "title",
      "label": "Photo title",
      "type": "text",
      "required": true
    },
    {
      "key": "album",
      "label": "Album",
      "type": "text",
      "required": true
    },
    {
      "key": "date",
      "label": "Date",
      "type": "date",
      "required": true
    },
    {
      "key": "image",
      "label": "Image URL",
      "type": "image",
      "required": false,
      "max": 350000
    },
    {
      "key": "alt",
      "label": "Image description",
      "type": "text",
      "required": false
    },
    {
      "key": "description",
      "label": "Caption",
      "type": "textarea",
      "required": true
    },
    {
      "key": "state",
      "label": "Publication state",
      "type": "select",
      "required": true,
      "options": [
        "Draft",
        "Published"
      ],
      "default": "Draft"
    }
  ],
  "settings": [
    {
      "key": "name",
      "label": "Collection name",
      "default": "Collected Light",
      "type": "text",
      "required": true
    },
    {
      "key": "headline",
      "label": "Headline",
      "default": "Keep the moments.",
      "type": "text",
      "required": true
    },
    {
      "key": "about",
      "label": "About this collection",
      "default": "A fictional collection of places, people and small details.",
      "type": "textarea",
      "required": true
    }
  ]
};
