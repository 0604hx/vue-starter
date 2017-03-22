# iview2.x 升级总结

> 当前版本：2.0.0-rc.2

iview2.x发布信息请看[这里](https://www.talkingcoder.com/article/6395692494071220203)

## Modal

官方对`Modal`的变化描述如下：

> **Modal**
>
> visible 改为 value，使用 v-model，style 改为 styles，$Modal 的关闭有改动，建议后面在纯 html 模式下测试

下面用一个实际例子来讲解，如1.x的代码如下
```html
<Modal :visible.sync="modal2" width="360">
    <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
    </p>
    <div style="text-align:center">
        <p>此任务删除后，下游 10 个任务将无法执行。</p>
        <p>是否继续删除？</p>
    </div>
    <div slot="footer">
        <i-button type="error" size="large" long :loading="modal_loading" @click="del">删除</i-button>
    </div>
</Modal>
```

修改后的代码如下：
```html
<Modal v-model="modal2" width="360" title="删除确认">
    <div style="text-align:center">
        <p>此任务删除后，下游 10 个任务将无法执行。</p>
        <p>是否继续删除？</p>
    </div>
    <div slot="footer">
        <i-button type="error" size="large" long :loading="modal_loading" @click.native="del">删除</i-button>
    </div>
</Modal>
```

## 开关 Siwtch

`Switch` 改成 `i-switch`

```html
记住我：<i-switch v-model="rememberMe"></i-switch>
```

## 表单 Form

```html
<i-form ref="account" :model="account" :rules="ruleValidate" :label-width="0" slot="left">
    <Form-item prop="name">
        <i-input v-model="account.name" placeholder="请输入姓名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
        </i-input>
    </Form-item>
    <Form-item prop="password">
        <i-input v-model="account.password" type="password" placeholder="请输入登录密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </i-input>
    </Form-item>

    <Form-item style="margin-bottom: 0px;">
        记住我
        <i-switch v-model="account.remember"></i-switch>
    </Form-item>
</i-form>
```

改动：
* v-ref 不用了，改成：`ref`

