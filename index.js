const fs = require("fs");
var request = require('request');
const axios = require("axios");
const prompts = require('prompts');

(async () => {
    const user_res = await prompts([{
        type: 'text',
        name: 'username',
        message: 'Enter your GitHub username: '
    },{
        type: 'text',
        name: 'password',
        message: 'Enter your GitHub password: '
    }]).then(function (user_res) {
            const queryUrl = 'https://api.github.com/user';
            axios.post(queryUrl, {}, {
                auth:{
                    username:user_res.username,
                    password:user_res.password,
                }
            }).then(function (res) {
                request.head(res.data.avatar_url, function(err, resp, body){
                    request(res.data.avatar_url).pipe(fs.createWriteStream('picture.png')).on('close', function () {
                        (async () => {
                            const questions = [
                                {
                                    type: 'text',
                                    name: 'title',
                                    message: 'Project Title'
                                },
                                {
                                    type: 'text',
                                    name: 'badge',
                                    message: 'Badge (Enter "badge_subject,badge_status,badge_color" eg. Build,Passing,Green)'
                                },
                                {
                                    type: 'text',
                                    name: 'description',
                                    message: 'Description of Project'
                                },
                                {
                                    type: 'text',
                                    name: 'content',
                                    message: 'Table of content (Comma separate for indexing eg x, y, z => 1.x 2.x 3.x)',
                                },
                                {
                                    type: 'text',
                                    name: 'installation',
                                    message: 'Installation',
                                }, {
                                    type: 'text',
                                    name: 'usage',
                                    message: 'Usage',
                                }
                                , {
                                    type: 'text',
                                    name: 'license',
                                    message: 'License',
                                },
                                {
                                    type: 'text',
                                    name: 'contributing',
                                    message: 'Contributing',
                                },
                                {
                                    type: 'text',
                                    name: 'tests',
                                    message: 'Tests',
                                }
                            ];
                            const response = await prompts(questions);
                            var readme = fs.createWriteStream("README.md");
                            readme.write("# " + response.title + '\n');
                            var badge_split = response.badge.split(',');
                            readme.write(`![Generic badge](https://img.shields.io/badge/${badge_split[0]}-${badge_split[1]}-${badge_split[2]}.svg) \n` );
                            readme.write('# Description  \n' + response.description + '\n');
                            readme.write('# Table of content \n');
                            var content_split = response.content.split(',');
                            var u;
                            for (u = 0; u<content_split.length; ++u){
                                readme.write('* ' + content_split[u] + '\n');
                            }
                            readme.write('# Installation \n' + response.installation + '\n');
                            readme.write('# Usage  \n' + response.usage + '\n');
                            readme.write('# License \n');
                            readme.write(`![Generic badge](https://img.shields.io/badge/License-${response.license}-orange.svg) \n` );
                            readme.write('# Contributing \n' + response.contributing + '\n');
                            readme.write('# Tests \n' + response.tests + '\n');
                            readme.write('## Username \n' + user_res.username + '\n');
                            readme.write('## Email \n' + res.data.email + '\n');
                            readme.write('## Picture \n' + '![alt text](picture.png)');
                            readme.end();
                        })();
                    });
                });

            })
        });
})();
