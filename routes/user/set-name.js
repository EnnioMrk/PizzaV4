/*

Search collections...
Collections
users
Search term or filter like created > "2022-01-01"...
Total found:
1
 Docs
|
PocketBase v0.22.20
Update (users)
Update a single users record.

Body parameters could be sent as application/json or multipart/form-data.

File upload is supported only via multipart/form-data.
For more info and examples you could check the detailed Files upload and handling docs .

Note that in case of a password change all previously issued tokens for the current record will be automatically invalidated and if you want your user to remain signed in you need to reauthenticate manually after the update call.

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.haus-marke.com');

...

// example update data
const data = {
    "username": "test_username_update",
    "emailVisibility": false,
    "password": "87654321",
    "passwordConfirm": "87654321",
    "oldPassword": "12345678",
    "name": "test"
};

const record = await pb.collection('users').update('RECORD_ID', data);
JavaScript SDK
API details
PATCH
/api/collections/users/records/:id

Path parameters
id	String	ID of the record to update.
Body Parameters
Auth fields
Optional
username
String	The username of the auth record.
Optional
email
String	The auth record email address.
This field can be updated only by admins or auth records with "Manage" access.
Regular accounts can update their email by calling "Request email change".
Optional
emailVisibility
Boolean	Whether to show/hide the auth record email when fetching the record data.
Optional
oldPassword
String	Old auth record password.
This field is required only when changing the record password. Admins and auth records with "Manage" access can skip this field.
Optional
password
String	New auth record password.
Optional
passwordConfirm
String	New auth record password confirmation.
Optional
verified
Boolean	Indicates whether the auth record is verified or not.
This field can be set only by admins or auth records with "Manage" access.
Schema fields
Optional
name
String	Plain text value.
Optional
avatar
File	File object.
Set to null to delete already uploaded file(s).
Query parameters
expand	String	Auto expand relations when returning the updated record. Ex.:
?expand=relField1,relField2.subRelField21
Supports up to 6-levels depth nested relations expansion.
The expanded relations will be appended to the record under the expand property (eg. "expand": {"relField1": {...}, ...}). Only the relations that the user has permissions to view will be expanded.
fields	String	
Comma separated string of the fields to return in the JSON response (by default returns all fields). Ex.:
?fields=*,expand.relField.name

* targets all keys from the specific depth level.

In addition, the following field modifiers are also supported:

:excerpt(maxLength, withEllipsis?)
Returns a short plain text version of the field string value.
Ex.: ?fields=*,description:excerpt(200,true)
Responses
{
  "id": "RECORD_ID",
  "collectionId": "_pb_users_auth_",
  "collectionName": "users",
  "username": "username123",
  "verified": false,
  "emailVisibility": true,
  "email": "test@example.com",
  "created": "2022-01-01 01:00:00.123Z",
  "updated": "2022-01-01 23:59:59.456Z",
  "name": "test",
  "avatar": "filename.jpg"
}
*/

export default (pb) => {
    return async (req, res) => {
        const { data, error } = await pb
            .collection('users')
            .update(req.cookies.id, {
                name: req.query.name,
            });
        if (error) {
            return res.status(400).json(error);
        }
        return res.status(200).json(data);
    };
};
