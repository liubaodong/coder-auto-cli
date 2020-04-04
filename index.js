#!/usr/bin/env node

console.log("coder-auto-cli---脚手架工具");
// 一些指令 coder list, coder init,  coder -h|--help, coder -V|--version
//  npm link 注册 npm unlink 注销
// 获取用户输入命令

/**用到的包
 *  npm i commander handlebars download-git-repo ora chalk log-symbols
 */

const { program } = require("commander");
const download = require("download-git-repo");
const inquirer = require("inquirer");
const handlebars = require("handlebars");
const fs = require("fs");
const ora = require("ora");
const chalk = require('chalk')
const logSymbols = require('log-symbols')

program.version("0.1.0");
const templates = {
  vuex: {
    url: "https://github.com/liubaodong/vuex.git", // 仓库地址
    downloadUrl: "https://github.com:liubaodong/vuex#master", // 下载地址
    description: "vuex-demo模板" // 模板描述
  },
  mms: {
    url: "https://github.com/liubaodong/myCodeMethods.git",
    downloadUrl: "direct:https://github.com/liubaodong/myCodeMethods#master",
    description: "自己的方法扩展"
  },
  "vue-admin": {
    url: "https://github.com/liubaodong/vue-admin.git",
    downloadUrl: "https://github.com:liubaodong/vue-admin#master",
    description: "vue-admin练习"
  }
};

// coder init a a-name
//    基于 a 模板进行初始化
// coder init b b-name
//    基于 b 模板进行初始化

program
  .command("init <template> <project>")
  .description("初始化项目模板")
  .action(function(templateName, projectName) {
    // 开始下载模板
    const spinner = ora("正个在下载模板...").start()
    // 根据模板名下载对应的模板到本地
    // download
    //'direct:https://github.com/xzblog/react-template.git' direct 所有人都可以下载
    //'https://github.com:xzblog/react-template.git' github.com:需要秘钥加载到本机适合私有项目
    //'http://xxxx:8080:HTML5/H5TemplateName#master'
    // 第一个参数:仓库地址
    // 第二个参数:下载路径
    const { downloadUrl } = templates[templateName];

    // console.log( `模板创建中`,templates[templateName]);
    // 下载之前 loading提示
    download(
      downloadUrl,
      projectName,
      {
        clone: true
      },
      err => {
       
        if (err) {
          // 下载失败
          spinner.fail(chalk.red('初始化失败原因:'));
          console.log(logSymbols.error, chalk.red(err))
          return  
        }
        console.log('err',err)
        // 把项目下的 package.json 读取出来
        // 使用向导的方式和用户交互
        // 使用模板引擎解析数据到 package.json
        // 解析完毕 写入 package.json
        // 下载成功
        spinner.succeed("下载成功啦啦啦...");
        inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "请输入项目名称"
            },
            {
              type: "input",
              name: "description",
              message: "请输入项目简介"
            },
            {
              type: "input",
              name: "author",
              message: "请输入作者名称"
            }
          ])
          .then(answers => {
            const packagePath = `${projectName}/package.json`;
            // 把采集到的 用户输入数据解析替换到package.json文件中
            const packageContent = fs.readFileSync(
              `${projectName}/package.json`,
              "utf-8"
            );
            const packageResult = handlebars.compile(packageContent)(answers);
          //  console.log(packageResult);
            fs.writeFileSync(packagePath, packageResult);
            console.log(logSymbols.success, chalk.green('初始化模板成功啦...'))
          });
      }
    );
  });

program
  .command("list")
  .description("查看可用模板")
  .action(() => {
    for (let key in templates) {
      console.log(`模板:${key}, 描述:${templates[key].description}`);
    }
  });

program.parse(process.argv);
//  根据命令做操作
