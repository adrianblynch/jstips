Tips = new Mongo.Collection("tips");

if (Meteor.isClient) {

	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_AND_EMAIL', // USERNAME_AND_EMAIL USERNAME_AND_OPTIONAL_EMAIL USERNAME_ONLY EMAIL_ONLY
	});

	Template.tips.helpers({
		tips: function () {
			return Tips.find({approved: true}, {sort: {created: -1}});
		}
	});

	Template.tips.events({
		"click button": function () {
			Tips.remove(this._id);
		}
	});

	Template.tipForm.helpers({
		tipPreview: function() {
			// How to populate this object?
			return {
				title: "Title...",
				created: new Date(),
				owner: {
					username: "Username"
				},
				body: "__bold__"
			};
		}
	});

	Template.tipForm.events({
		"submit form": function(e) {
			var title = e.target.title;
			var body = e.target.body;
			Tips.insert({
				title: title.value,
				body: body.value,
				created: new Date(),
				approved: true, // Whilst developing - Will be an admin feature
				owner: {
					id: Meteor.userId(),
					username: Meteor.user().username
				}
			});
			title.value = "";
			body.value = "";
			document.getElementById("preview").innerHTML = "";
			return false;
		},
		"click input[name='myTips']": function(e) {
			Session.set("title", e.target.value);
		},
		"keyup textarea[name='body']": function(e) {
			var body = e.target.value;
			var preview = "";
			try {
				preview = marked(body, {sanitize: true});
			} catch(e) {
				// Do nothing - This is crap but it'll work for now
			}
			document.getElementById("preview").innerHTML = preview;
		}
	});

	marked('# Marked in browser\n\nRendered by **marked**.');

}
