import{_ as t}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c as i,a as n,b as s,d as a,e as l,r as p}from"./app.bb897e12.js";const r={},c=l('<ul><li><a href="#mysql-%E7%AC%94%E8%AE%B0">MySQL \u7B14\u8BB0</a><ul><li><a href="#%E5%AE%89%E8%A3%85%E9%83%A8%E7%BD%B2">\u5B89\u88C5\u90E8\u7F72</a></li><li><a href="#%E9%85%8D%E7%BD%AE">\u914D\u7F6E</a></li><li><a href="#%E4%BD%BF%E7%94%A8">\u4F7F\u7528</a></li></ul></li><li><a href="#%E6%9E%B6%E6%9E%84">\u67B6\u6784</a></li><li><a href="#%E5%AD%A6%E4%B9%A0%E8%BF%87%E7%A8%8B%E4%B8%AD%E7%9A%84%E7%96%91%E9%97%AE">\u5B66\u4E60\u8FC7\u7A0B\u4E2D\u7684\u7591\u95EE</a></li><li><a href="#%E6%8E%92%E9%9A%9C%E6%8C%87%E5%8D%97">\u6392\u969C\u6307\u5357</a></li><li><a href="#%E5%85%B6%E4%BB%96">\u5176\u4ED6</a></li><li><a href="#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99">\u53C2\u8003\u8D44\u6599</a></li></ul><h1 id="mysql-\u7B14\u8BB0" tabindex="-1"><a class="header-anchor" href="#mysql-\u7B14\u8BB0" aria-hidden="true">#</a> MySQL \u7B14\u8BB0</h1><p><img src="https://baiyp.ren/images/mysql/mysql01.png" alt="alt"></p><h2 id="\u5B89\u88C5\u90E8\u7F72" tabindex="-1"><a class="header-anchor" href="#\u5B89\u88C5\u90E8\u7F72" aria-hidden="true">#</a> \u5B89\u88C5\u90E8\u7F72</h2>',4),d={href:"https://baiyp.ren/Docker%E5%AE%89%E8%A3%85MySql.html#MySQL%E5%87%86%E5%A4%87%E6%95%B0%E6%8D%AE",target:"_blank",rel:"noopener noreferrer"},u=l(`<h2 id="\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u914D\u7F6E" aria-hidden="true">#</a> \u914D\u7F6E</h2><ul><li><p>\u67E5\u770B\u914D\u7F6E</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-proot</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;show variables like &#39;log_bin%&#39;&quot;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="\u4F7F\u7528" tabindex="-1"><a class="header-anchor" href="#\u4F7F\u7528" aria-hidden="true">#</a> \u4F7F\u7528</h2>`,3),k={href:"https://blog.csdn.net/guoxiaoweitaiyuan/article/details/104535774",target:"_blank",rel:"noopener noreferrer"},m=l(`<div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">set</span> <span class="token variable">@rownum</span><span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">update</span> bbc_device <span class="token keyword">set</span> device_list_id<span class="token operator">=</span><span class="token punctuation">(</span><span class="token keyword">select</span> <span class="token variable">@rownum</span> :<span class="token operator">=</span> <span class="token variable">@rownum</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token keyword">as</span> nid<span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),v={href:"https://blog.csdn.net/u012604745/article/details/80642015",target:"_blank",rel:"noopener noreferrer"},b=l(`<div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">update</span> bbc_device a <span class="token keyword">join</span> bbc_device_list b <span class="token keyword">on</span> a<span class="token punctuation">.</span>device_list_id <span class="token operator">=</span> b<span class="token punctuation">.</span>id <span class="token keyword">set</span> b<span class="token punctuation">.</span>device_id<span class="token operator">=</span>a<span class="token punctuation">.</span>id<span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,1),h=l(`<li><p>\u67E5\u770B\u8FDE\u63A5\u6570</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">show</span> <span class="token keyword">full</span> processlist<span class="token punctuation">;</span>
<span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> information_schema<span class="token punctuation">.</span>processlist <span class="token keyword">where</span> INFO <span class="token operator">is</span> <span class="token operator">not</span> <span class="token boolean">NULL</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>\u67E5\u770B\u8868\u7D22\u5F15</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">SHOW</span> <span class="token keyword">INDEX</span> <span class="token keyword">FROM</span> tb_name<span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>\u663E\u793A\u8B66\u544A\u4FE1\u606F</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">show</span> <span class="token keyword">warnings</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>\u589E\u5220\u5B57\u6BB5</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token comment">-- \u5220</span>
<span class="token keyword">alter</span> <span class="token keyword">table</span> upgrade_plan <span class="token keyword">drop</span> <span class="token keyword">column</span> auto_join<span class="token punctuation">;</span>

<span class="token comment">-- \u589E</span>
<span class="token keyword">alter</span> <span class="token keyword">table</span> upgrade_plan <span class="token keyword">add</span> <span class="token keyword">column</span> retry_time <span class="token keyword">int</span> <span class="token keyword">default</span> <span class="token number">0</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>\u6570\u636E\u5E93\u5BFC\u51FA</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code>mysqldump <span class="token operator">-</span>u \u7528\u6237\u540D <span class="token operator">-</span>p \u6570\u636E\u5E93\u540D <span class="token operator">&gt;</span> \u5BFC\u51FA\u7684\u6587\u4EF6\u540D

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>`,5),_=n("p",null,"\u6570\u636E\u8868\u5BFC\u51FA\u5BFC\u5165",-1),g={href:"https://www.cnblogs.com/xzlive/p/15589204.html",target:"_blank",rel:"noopener noreferrer"},y=l(`<div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token comment">-- \u5BFC\u51FA</span>
mysqldump <span class="token operator">-</span>uxxx <span class="token operator">-</span>pxxx db_name tb1 tb2 tb3 <span class="token operator">&gt;</span> <span class="token keyword">backup</span><span class="token punctuation">.</span><span class="token keyword">sql</span>

<span class="token comment">-- \u5BFC\u5165</span>
mysql <span class="token operator">-</span>uxxx <span class="token operator">-</span>pxxx db_name <span class="token operator">&lt;</span> <span class="token keyword">backup</span><span class="token punctuation">.</span><span class="token keyword">sql</span>

<span class="token comment">-- \u6279\u91CF\u5BFC\u5165\uFF08\u6CE8\u610F\u6587\u4EF6\u987A\u5E8F\uFF09</span>
<span class="token keyword">for</span> <span class="token keyword">SQL</span> <span class="token operator">in</span> <span class="token operator">*</span><span class="token punctuation">.</span><span class="token keyword">sql</span><span class="token punctuation">;</span> <span class="token keyword">do</span> mysql <span class="token operator">-</span>uroot <span class="token operator">-</span>p<span class="token string">&quot;xxx&quot;</span> mydb <span class="token operator">&lt;</span> $<span class="token keyword">SQL</span><span class="token punctuation">;</span> done

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),w=l(`<li><p>\u5BFC\u51FA csv</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token comment">-- \u5BFC\u51FA csv</span>
<span class="token comment">-- ERROR 1290 (HY000) at line 1: The MySQL server is running with the --secure-file-priv option so it cannot execute this statement</span>
<span class="token comment">-- \u4FEE\u6539 MySQL \u914D\u7F6E\u6587\u4EF6 my.ini\uFF0C\u6DFB\u52A0 secure_file_priv=&quot;/root/hjj&quot;\uFF0C\u91CD\u542F mysql</span>

<span class="token comment">-- ERROR 1 (HY000) at line 1: Can&#39;t create/write to file&#39;/xxxx/cfg_dict.csv&#39; (Errcode: 13 - Permission denied)</span>
<span class="token comment">-- https://blog.csdn.net/weixin_30681615/article/details/102005340</span>
<span class="token comment">-- chmod -R 777 /path/to/your/export</span>

<span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> test <span class="token keyword">into</span> <span class="token keyword">outfile</span> <span class="token string">&#39;/tmp/test.csv&#39;</span> <span class="token keyword">fields</span> <span class="token keyword">terminated</span> <span class="token keyword">by</span> <span class="token string">&quot;,&quot;</span>  <span class="token keyword">escaped</span> <span class="token keyword">by</span> <span class="token string">&#39;&#39;</span> <span class="token keyword">optionally</span> <span class="token keyword">enclosed</span>  <span class="token keyword">by</span> <span class="token string">&#39;&#39;</span>   <span class="token keyword">lines</span> <span class="token keyword">terminated</span> <span class="token keyword">by</span> <span class="token string">&#39;\\n&#39;</span> <span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,1),q={href:"https://blog.51cto.com/u_3664660/3213261",target:"_blank",rel:"noopener noreferrer"},f=n("p",null,[s("\u6539\u7528 "),n("code",null,"show full fields from [tablename]"),s(" \u6216\u8005 "),n("code",null,"show create table [table_name]")],-1),x={href:"https://www.learnfk.com/question/mysql/11331573.html",target:"_blank",rel:"noopener noreferrer"},E=l(`<div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">insert</span> <span class="token keyword">into</span> my_table<span class="token punctuation">(</span>col1<span class="token punctuation">,</span> col2<span class="token punctuation">)</span> <span class="token keyword">select</span> col1<span class="token punctuation">,</span> col2 <span class="token keyword">from</span> my_table <span class="token keyword">where</span> pk_id<span class="token operator">=</span><span class="token punctuation">[</span>row_id<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,1),B=l(`<li><p><code>insert into</code> \u591A\u6761\u6570\u636E</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">insert</span> <span class="token keyword">into</span> my_table <span class="token keyword">values</span>
<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&quot;xxx&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;yyy&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;2030-01-02 11:10:09&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token string">&quot;xxx&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;yyy&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;2030-01-02 11:10:09&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>\u67E5\u770B\u5B58\u50A8\u8FC7\u7A0B</p><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">SHOW</span> <span class="token keyword">PROCEDURE</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">&#39;%xxx&#39;</span><span class="token punctuation">;</span>
<span class="token comment">-- \u5220\u9664</span>
<span class="token keyword">DROP</span> <span class="token keyword">PROCEDURE</span> <span class="token punctuation">[</span> <span class="token keyword">IF</span> <span class="token keyword">EXISTS</span> <span class="token punctuation">]</span> <span class="token punctuation">[</span>procedure_name<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">-- \u5B58\u50A8\u8FC7\u7A0B\u540D\u79F0\u4E0D\u8981\u52A0\u53CC\u5F15\u53F7</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,2),L={href:"https://www.nhooo.com/note/qa019r.html",target:"_blank",rel:"noopener noreferrer"},A=n("li",null,[n("p",null,[s("\u6A21\u7CCA\u67E5\u627E\u8868 "),n("code",null,"show tables like '%log%';")])],-1),S=l(`<h1 id="\u67B6\u6784" tabindex="-1"><a class="header-anchor" href="#\u67B6\u6784" aria-hidden="true">#</a> \u67B6\u6784</h1><p><img src="https://pic2.zhimg.com/v2-f8d848179f49e357c4e348c68b4e62b5_r.jpg" alt="alt"></p><h1 id="\u5B66\u4E60\u8FC7\u7A0B\u4E2D\u7684\u7591\u95EE" tabindex="-1"><a class="header-anchor" href="#\u5B66\u4E60\u8FC7\u7A0B\u4E2D\u7684\u7591\u95EE" aria-hidden="true">#</a> \u5B66\u4E60\u8FC7\u7A0B\u4E2D\u7684\u7591\u95EE</h1><h1 id="\u6392\u969C\u6307\u5357" tabindex="-1"><a class="header-anchor" href="#\u6392\u969C\u6307\u5357" aria-hidden="true">#</a> \u6392\u969C\u6307\u5357</h1><ul><li><p><code>The server quit without updating PID file\uFF08/var/run/mysqld/mysqld.id</code></p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>mysqld: Can<span class="token string">&#39;t create/write to file &#39;</span>/tmp/ibxzV7PR&#39; <span class="token punctuation">(</span>Errcode: <span class="token number">13</span> - Permission denied<span class="token punctuation">)</span>
<span class="token number">2021</span>-03-10T16:25:28.308867+08:00 <span class="token number">0</span> <span class="token punctuation">[</span>ERROR<span class="token punctuation">]</span> InnoDB: Unable to create temporary <span class="token function">file</span><span class="token punctuation">;</span> errno: <span class="token number">13</span>
<span class="token number">2021</span>-03-10T16:25:28.308873+08:00 <span class="token number">0</span> <span class="token punctuation">[</span>ERROR<span class="token punctuation">]</span> InnoDB: Plugin initialization aborted with error Generic error

<span class="token comment"># \u7ED9 /tmp \u52A0\u4E2A 777 \u7684\u6743\u9650</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h1 id="\u5176\u4ED6" tabindex="-1"><a class="header-anchor" href="#\u5176\u4ED6" aria-hidden="true">#</a> \u5176\u4ED6</h1><ul><li><p><code>mysql</code> \u6700\u591A\u53EF\u4EE5\u67E5\u591A\u5C11\u6570\u636E</p><p>\u6BD4\u5982\u6709\u4E00\u4EBF\u6570\u636E\uFF0C\u7136\u540E\u505A\u5206\u9875\uFF0C\u771F\u7684\u80FD\u5206\u9875\u51FA\u6765\u5417</p></li><li><p><code>mysql</code> \u6BCF\u79D2\u6700\u591A\u5904\u7406 <code>2000</code> \u4E2A\u8BF7\u6C42</p></li><li><p>\u8FDE\u63A5\u6C60</p><ul><li><p>\u5982\u679C\u4F60\u6709 10000 \u4E2A\u5E76\u53D1\u7528\u6237\uFF0C\u8BBE\u7F6E\u4E00\u4E2A 10000 \u7684\u8FDE\u63A5\u6C60\u57FA\u672C\u7B49\u4E8E\u5931\u4E86\u667A\u30021000 \u4ECD\u7136\u5F88\u6050\u6016\u3002\u5373\u662F 100 \u4E5F\u592A\u591A\u4E86\u3002\u4F60\u9700\u8981\u4E00\u4E2A 10 \u6765\u4E2A\u8FDE\u63A5\u7684\u5C0F\u8FDE\u63A5\u6C60\uFF0C\u7136\u540E\u8BA9\u5269\u4E0B\u7684\u4E1A\u52A1\u7EBF\u7A0B\u90FD\u5728\u961F\u5217\u91CC\u7B49\u5F85\u3002\u8FDE\u63A5\u6C60\u4E2D\u7684\u8FDE\u63A5\u6570\u91CF\u5E94\u8BE5\u7B49\u4E8E\u4F60\u7684\u6570\u636E\u5E93\u80FD\u591F\u6709\u6548\u540C\u65F6\u8FDB\u884C\u7684\u67E5\u8BE2\u4EFB\u52A1\u6570\uFF08\u901A\u5E38\u4E0D\u4F1A\u9AD8\u4E8E 2*CPU \u6838\u5FC3\u6570\uFF09\u3002</p></li><li><p>\u6211\u4EEC\u7ECF\u5E38\u89C1\u5230\u4E00\u4E9B\u5C0F\u89C4\u6A21\u7684 web \u5E94\u7528\uFF0C\u5E94\u4ED8\u7740\u5927\u7EA6\u5341\u6765\u4E2A\u7684\u5E76\u53D1\u7528\u6237\uFF0C\u5374\u4F7F\u7528\u7740\u4E00\u4E2A 100 \u8FDE\u63A5\u6570\u7684\u8FDE\u63A5\u6C60\u3002\u8FD9\u4F1A\u5BF9\u4F60\u7684\u6570\u636E\u5E93\u9020\u6210\u6781\u5176\u4E0D\u5FC5\u8981\u7684\u8D1F\u62C5</p></li></ul></li></ul><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>1. \u53EF\u7528\u53CD\u5F15\u53F7\uFF08\`\uFF09\u4E3A\u6807\u8BC6\u7B26\uFF08\u5E93\u540D\u3001\u8868\u540D\u3001\u5B57\u6BB5\u540D\u3001\u7D22\u5F15\u3001\u522B\u540D\uFF09\u5305\u88F9\uFF0C\u4EE5\u907F\u514D\u4E0E\u5173\u952E\u5B57\u91CD\u540D\uFF01\u4E2D\u6587\u4E5F\u53EF\u4EE5\u4F5C\u4E3A\u6807\u8BC6\u7B26\uFF01
2. \u6BCF\u4E2A\u5E93\u76EE\u5F55\u5B58\u5728\u4E00\u4E2A\u4FDD\u5B58\u5F53\u524D\u6570\u636E\u5E93\u7684\u9009\u9879\u6587\u4EF6db.opt\u3002
3. \u6CE8\u91CA\uFF1A
    \u5355\u884C\u6CE8\u91CA # \u6CE8\u91CA\u5185\u5BB9
    \u591A\u884C\u6CE8\u91CA /* \u6CE8\u91CA\u5185\u5BB9 */
    \u5355\u884C\u6CE8\u91CA -- \u6CE8\u91CA\u5185\u5BB9        (\u6807\u51C6SQL\u6CE8\u91CA\u98CE\u683C\uFF0C\u8981\u6C42\u53CC\u7834\u6298\u53F7\u540E\u52A0\u4E00\u7A7A\u683C\u7B26\uFF08\u7A7A\u683C\u3001TAB\u3001\u6362\u884C\u7B49\uFF09)
4. \u6A21\u5F0F\u901A\u914D\u7B26\uFF1A
    _    \u4EFB\u610F\u5355\u4E2A\u5B57\u7B26
    %    \u4EFB\u610F\u591A\u4E2A\u5B57\u7B26\uFF0C\u751A\u81F3\u5305\u62EC\u96F6\u5B57\u7B26
    \u5355\u5F15\u53F7\u9700\u8981\u8FDB\u884C\u8F6C\u4E49 \\&#39;
5. CMD\u547D\u4EE4\u884C\u5185\u7684\u8BED\u53E5\u7ED3\u675F\u7B26\u53EF\u4EE5\u4E3A &quot;;&quot;, &quot;\\G&quot;, &quot;\\g&quot;\uFF0C\u4EC5\u5F71\u54CD\u663E\u793A\u7ED3\u679C\u3002\u5176\u4ED6\u5730\u65B9\u8FD8\u662F\u7528\u5206\u53F7\u7ED3\u675F\u3002delimiter \u53EF\u4FEE\u6539\u5F53\u524D\u5BF9\u8BDD\u7684\u8BED\u53E5\u7ED3\u675F\u7B26\u3002
6. SQL\u5BF9\u5927\u5C0F\u5199\u4E0D\u654F\u611F
7. \u6E05\u9664\u5DF2\u6709\u8BED\u53E5\uFF1A\\c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),D={href:"https://www.cnblogs.com/edgedance/p/7090800.html",target:"_blank",rel:"noopener noreferrer"},R={href:"https://blog.csdn.net/qq624202120/article/details/108594107",target:"_blank",rel:"noopener noreferrer"},Q={href:"https://www.cnblogs.com/gaogao67/p/11042853.html",target:"_blank",rel:"noopener noreferrer"},M={href:"https://blog.csdn.net/qq_16681169/article/details/73359670",target:"_blank",rel:"noopener noreferrer"},O={href:"https://blog.csdn.net/lpp_dd/article/details/83183816",target:"_blank",rel:"noopener noreferrer"},I={href:"https://www.jianshu.com/p/2b258bfe00e5",target:"_blank",rel:"noopener noreferrer"},T={href:"https://www.cnblogs.com/Kidezyq/p/9239484.html?utm_source=debugrun&utm_medium=referral",target:"_blank",rel:"noopener noreferrer"},C={href:"https://blog.csdn.net/u013905744/article/details/102897226",target:"_blank",rel:"noopener noreferrer"},P={href:"https://blog.csdn.net/wuyu6394232/article/details/99061955",target:"_blank",rel:"noopener noreferrer"},U=n("h1",{id:"\u53C2\u8003\u8D44\u6599",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u53C2\u8003\u8D44\u6599","aria-hidden":"true"},"#"),s(" \u53C2\u8003\u8D44\u6599")],-1),j={href:"https://blog.csdn.net/hxpjava1/article/details/79407961",target:"_blank",rel:"noopener noreferrer"},F=n("code",null,"MySQL",-1),G={href:"https://www.cnblogs.com/lyq-biu/p/10859273.html",target:"_blank",rel:"noopener noreferrer"};function N(z,V){const e=p("ExternalLinkIcon");return o(),i("div",null,[c,n("ul",null,[n("li",null,[n("a",d,[s("\u6D4B\u8BD5\u6570\u636E\u5BFC\u5165"),a(e)])])]),u,n("ul",null,[n("li",null,[n("p",null,[n("a",k,[s("\u600E\u4E48\u9012\u589E\u5730\u4FEE\u6539\u4E00\u4E2A\u8868\u6570\u636E\u7684\u67D0\u4E2A\u5B57\u6BB5"),a(e)])]),m]),n("li",null,[n("p",null,[n("a",v,[s("\u6839\u636E A \u8868\u53BB\u66F4\u65B0 B \u8868"),a(e)])]),b]),h,n("li",null,[_,n("p",null,[n("a",g,[s("mysql \u5BFC\u5165\u62A5@@GLOBAL.GTID_PURGED can only be set when @@GLOBAL.GTID_EXECUTED is empty \u9519\u8BEF"),a(e)])]),y]),w,n("li",null,[n("p",null,[n("a",q,[s("desc \u770B\u4E0D\u5230\u8868\u5B57\u6BB5\u6CE8\u91CA\u4FE1\u606F"),a(e)])]),f]),n("li",null,[n("p",null,[n("a",x,[s("\u590D\u5236\u4E00\u884C"),a(e)])]),E]),B,n("li",null,[n("p",null,[n("a",L,[s("MySQL \u5B58\u50A8\u8FC7\u7A0B\u4E2D\u201C @\u201D\u7B26\u53F7\u7684\u7528\u6CD5\u662F\u4EC0\u4E48"),a(e)])])]),A]),S,n("ul",null,[n("li",null,[n("p",null,[n("a",D,[s("\u7ED3\u679C\u8F93\u51FA\u5230\u6587\u4EF6"),a(e)])])]),n("li",null,[n("p",null,[n("a",R,[s("MySQL \u9501\u7684\u603B\u7ED3 \u548C \u4E00\u6B21\u63D2\u5165\u610F\u5411\u9501\u7684\u6B7B\u9501\u8FD8\u539F\u5206\u6790"),a(e)])])]),n("li",null,[n("p",null,[n("a",Q,[s("MySQL Lock--gap before rec insert intention waiting"),a(e)])])]),n("li",null,[n("p",null,[n("a",M,[s("\u5E76\u53D1\u63D2\u5165\u5F15\u53D1\u7684\u6B7B\u9501\u95EE\u9898\u6392\u67E5"),a(e)])])]),n("li",null,[n("p",null,[n("a",O,[s("\u5728\u4E00\u4E2A\u4E8B\u52A1\u4E2D\uFF0C\u5148\u63D2\u5165\u518D\u67E5\u8BE2\uFF0C\u80FD\u67E5\u5230\u6570\u636E\u5417"),a(e)])])]),n("li",null,[n("p",null,[n("a",I,[s("mysql for update \u6B7B\u9501\u95EE\u9898"),a(e)])])]),n("li",null,[n("p",null,[n("a",T,[s("For update \u5E26\u6765\u7684\u601D\u8003"),a(e)])])]),n("li",null,[n("p",null,[n("a",C,[s("\u91CD\u590D\u63D2\u5165\u76F8\u540C\u6570\u636E\u5BFC\u81F4 deadlock \u95EE\u9898\uFF1ADeadlock found when trying to get lock\uFF1B try"),a(e)])])]),n("li",null,[n("p",null,[n("a",P,[s("\u610F\u5411\u9501\u5BFC\u81F4\u6B7B\u9501"),a(e)])])])]),U,n("ul",null,[n("li",null,[n("p",null,[n("a",j,[F,s(" \u7684\u9501"),a(e)])])]),n("li",null,[n("p",null,[n("a",G,[s("\u5F00\u542F\u8FDC\u7A0B\u8BBF\u95EE"),a(e)])])])])])}const K=t(r,[["render",N],["__file","00. MySQL \u7B14\u8BB0.html.vue"]]);export{K as default};
