define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "docs/main.js",
    "group": "D__Projektit_SSSF_week2_docs_main_js",
    "groupTitle": "D__Projektit_SSSF_week2_docs_main_js",
    "name": ""
  },
  {
    "type": "delete",
    "url": "/delete",
    "title": "deleting an existing object from database",
    "name": "Delete_delete",
    "group": "Deletes",
    "description": "<p>Delete existing object's data from the database</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "FormData",
            "description": "<p>A form data with the object ID that you want to delete from the database</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "send",
            "description": "<p>Object is deleted from database and will send response with status 'OK' and post</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "docs/server.js",
    "groupTitle": "Deletes"
  },
  {
    "type": "get",
    "url": "/posts",
    "title": "Get all the Spy objects from the database",
    "name": "GetAll_get",
    "group": "Gets",
    "description": "<p>Get get all existing objects from the database</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "FormData",
            "description": "<p>A form data with the requirements to get all items from database</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "send",
            "description": "<p>Get objects from the database with find from the database and send a response with status 'OK' and post that includes the data gotten from the database</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "docs/server.js",
    "groupTitle": "Gets"
  },
  {
    "type": "get",
    "url": "/posts/:search",
    "title": "Search for an object from the database",
    "name": "Search_get",
    "group": "Gets",
    "description": "<p>Search Search for objects from the database with requirements</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "FormData",
            "description": "<p>A form data object with the search parameters as requirements.params.search</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "send",
            "description": "<p>Send response with status 'OK' and post that includes search results from the database</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "docs/server.js",
    "groupTitle": "Gets"
  },
  {
    "type": "patch",
    "url": "/update",
    "title": "Update an existing object in database",
    "name": "Update_patch",
    "group": "Patches",
    "description": "<p>Change existing object's data within the database and save it</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "FormData",
            "description": "<p>A form data with the object that you want to update/edit</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "send",
            "description": "<p>Object is updated in database and will send response with status 'OK' and post</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "docs/server.js",
    "groupTitle": "Patches"
  },
  {
    "type": "post",
    "url": "/new",
    "title": "adding a post to database",
    "name": "Add_new",
    "group": "Posts",
    "description": "<p>Create new objects into the database based on received form data</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "FormData",
            "description": "<p>A form data object submitted from the front end</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "send",
            "description": "<p>Sends response with status 'OK' and post</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "docs/server.js",
    "groupTitle": "Posts"
  }
] });
