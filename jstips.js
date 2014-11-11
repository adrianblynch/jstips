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
		title: function() {
			return Session.get("title");
		},
		body: function() {
			return Session.get("body");
		},
		preview: function() {
			var preview = "";
			try {
				preview = marked(Session.get("body"));
			} catch(e) {
				// Do nothing - This is crap but it'll work for now
			}
			return preview; // How to push the HTML into the DOM and not the entities?
		},
	});

	Template.tipForm.events({
		"submit form": function(e) {
			Tips.insert({
				title: Session.get("title"),
				body: Session.get("body"),
				created: new Date(),
				approved: true, // Whilst developing - Will be an admin feature
				owner: {
					id: Meteor.userId(),
					username: Meteor.user().username
				}
			});
			Session.set("title", "");
			Session.set("body", "");
			Session.set("preview", "");
			return false;
		},
		"keyup input[name='title']": function(e) {
			Session.set("title", e.target.value);
		},
		"keyup textarea[name='body']": function(e) {
			Session.set("body", e.target.value);
		},
		// "click input[name='myTips']": function(e) {
		// 	//Session.set("title", e.target.value);
		// }
	});

	marked('# Marked in browser\n\nRendered by **marked**.');

}
