private initializeBullets() {
    const bulletGroup: Phaser.Physics.Arcade.Group = this.physics.add.group();

    this.time.addEvent({
      delay: GameOptions.bulletRate,
      loop: true,
      callback: () => {
        const enemies = this.enemyGroup.getChildren();
        if (enemies.length > 0) {
          const closestEnemy = this.physics.closest(this.player, enemies);
          if (closestEnemy && closestEnemy.body) {
            const bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
            bulletGroup.add(bullet);

            const angle = Phaser.Math.Angle.Between(
              this.player.body.position.x,
              this.player.body.position.y,
              closestEnemy.body.position.x,
              closestEnemy.body.position.y
            );
            const speed = GameOptions.bulletSpeed;
            bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
          }
        }
      },
    });

    this.physics.add.collider(bulletGroup, this.enemyGroup, (bullet: any, enemy: any) => {
      bulletGroup.killAndHide(bullet);
      bullet.body.checkCollision.none = true;
      this.enemyGroup.killAndHide(enemy);
      enemy.body.checkCollision.none = true;
    });
  }