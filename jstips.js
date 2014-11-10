Tips = new Mongo.Collection("tips");

if (Meteor.isClient) {
	// counter starts at 0
	//Session.setDefault("counter", 0);

	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_AND_EMAIL', // USERNAME_AND_EMAIL USERNAME_AND_OPTIONAL_EMAIL USERNAME_ONLY EMAIL_ONLY
		// extraSignupFields: [{
		// 	fieldName: 'displayName',
		// 	fieldLabel: 'Display name'
		// }]
		// Look at: http://stackoverflow.com/questions/23507384/adding-more-fields-to-meteor-user-accounts
	});

	Template.tips.helpers({
		tips: function () {
			return Tips.find({approved: true}, {sort: {created: -1}});
		}
	});

	/*Template.hello.events({
		'click button': function () {
			// increment the counter when button is clicked
			Session.set("counter", Session.get("counter") + 1);
		}
	});*/

	Template.tipForm.events({
		"submit form": function(e) {
			var title = e.target.title.value;
			var body = e.target.body.value;
			console.log("Adding: ", title, body);
			console.log(Meteor.user());
			// CONTUINUE: Add logged in user details to the tip - Find a way to require username AND password
			Tips.insert({
				title: title,
				body: body,
				created: new Date(),
				approved: true, // Whilst developing - Will be an admin feature
				owner: {
					id: Meteor.userId(),
					username: Meteor.user().username
				}
			});
			return false;
		}
	});

}

if (Meteor.isServer) {
	Meteor.startup(function () {
		//
	});
}
